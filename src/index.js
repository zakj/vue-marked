import dedent from 'dedent';
import marked from 'marked';

// In a perfect world, we could use Vue's patch(null, vnode) here, but it's not
// available anywhere in a SSR context. This hack loses property/attribute data
// but is better than nothing.
function stringifyVNode(vnode) {
  if (vnode.tag) {
    const content = vnode.children ? vnode.children.map(stringifyVNode) : vnode.text;
    return `<${vnode.tag}>${content}</${vnode.tag}>`;
  }
  return vnode.text;
}

export default {
  name: 'VueMarked',
  functional: true,

  props: {
    breaks: {
      type: Boolean,
      default: false,
    },
    dedent: {
      type: Boolean,
      default: true,
    },
    sanitize: {
      type: Boolean,
      default: true,
    },
    smartypants: {
      type: Boolean,
      default: true,
    },
  },

  render(createElement, context) {
    const props = context.props;
    const options = {
      breaks: props.breaks,
      sanitize: props.sanitize,
      smartypants: props.smartypants,
    };
    let text = context.children.map(stringifyVNode).join('');
    if (props.dedent) {
      text = dedent(text);
    }
    return createElement('div', {domProps: {innerHTML: marked(text, options)}});
  },
};
