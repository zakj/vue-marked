import test from 'ava';
import VueMd from './src';

function mockCreateElement(tag, {domProps: {innerHTML: text}}) {
  return text;
}

function render({props={}, children=[]}={}) {
  return VueMd.render(mockCreateElement, {props, children}).trim();
}

test('simple renders', t => {
  const cases = [
    ['', ''],
    ['test', '<p>test</p>'],
    ['# header', '<h1 id="header">header</h1>'],
  ];
  cases.forEach(([input, expected]) => {
    t.is(render({children: [{text: input}]}), expected);
  });
});

test('multiple children', t => {
  t.is(
    render({children: [{text: 'one'}, {text: 'two\n\n'}, {text: 'three'}]}),
    '<p>onetwo</p>\n<p>three</p>'
  );
});

test('breaks', t => {
  t.is(
    render({
      props: {breaks: false},
      children: [{text: 'one\ntwo\nthree'}],
    }),
    '<p>one\ntwo\nthree</p>'
  );

  t.is(
    render({
      props: {breaks: true},
      children: [{text: 'one\ntwo\nthree'}],
    }),
    '<p>one<br>two<br>three</p>'
  );
});

test('dedent', t => {
  t.is(
    render({
      props: {dedent: false},
      children: [{text: '    indented\n    text\n      extra'}],
    }),
    '<pre><code>indented\ntext\n  extra\n</code></pre>'
  );

  t.is(
    render({
      props: {dedent: true},
      children: [{text: '    indented\n    text\n      extra'}],
    }),
    '<p>indented\ntext\n  extra</p>'
  );
});

test('sanitize', t => {
  t.is(
    render({
      props: {sanitize: false},
      children: [{text: 'one '}, {tag: 'i', children: [{text: 'two'}]}],
    }),
    '<p>one <i>two</i></p>'
  );

  t.is(
    render({
      props: {sanitize: true},
      children: [{text: 'one '}, {tag: 'i', children: [{text: 'two'}]}],
    }),
    '<p>one &lt;i&gt;two&lt;/i&gt;</p>'
  );
});

test('smartypants', t => {
  t.is(
    render({
      props: {smartypants: false},
      children: [{text: `I'm testing---"quotes"`}],
    }),
    `<p>I&#39;m testing---&quot;quotes&quot;</p>`
  );

  t.is(
    render({
      props: {smartypants: true},
      children: [{text: `I'm testing---"quotes"`}],
    }),
    `<p>I’m testing—“quotes”</p>`
  );
});
