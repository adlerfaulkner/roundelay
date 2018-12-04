import React from 'react';
import PropTypes from 'prop-types';

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');
}

function findLastTextNode(node: Node) : Node | null {
  if (node.nodeType === Node.TEXT_NODE) return node;
  let children = node.childNodes;
  for (let i = children.length-1; i>=0; i--) {
    let textNode = findLastTextNode(children[i]);
    if (textNode !== null) return textNode;
  }
  return null;
}

function replaceCaret(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = findLastTextNode(el);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === target;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(target, target.nodeValue.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (el instanceof HTMLElement) el.focus();
  }
}

/**
 * A simple component for an html element with editable contents.
 */
class TitleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.lastHtml = this.props.title;
    this.el = React.createRef();
  }

  // getEl = () => this.el.current;

  render() {
    const { title } = this.props;
    let placeholderStyle;
    if (title.length > 0) {
      placeholderStyle = { display: 'none' }
    }

    return (
      <div className='title-editor contenteditable' ref={this.el} contentEditable={true} onInput={this.emitChange} onBlur={this.props.onBlur || this.emitChange} dangerouslySetInnerHTML={{ __html: title }}></div>
    )
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.el.current;

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.title) !== normalizeHtml(el.innerHTML)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const el = this.el.current;
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.title !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.title;
    }
    replaceCaret(el);
  }

  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = this.el.current;
    if (!el) return;

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html
        }
      });
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }
}

export interface Props {
  title: string,
  onChange?: Function,
  onBlur?: Function,
}

export default TitleEditor;
