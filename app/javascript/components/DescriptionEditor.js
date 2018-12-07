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
class DescriptionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.lastHtml = this.props.description;
    this.el = typeof this.props.innerRef === 'function' ? { current: null } : React.createRef();
  }

  getEl = () => (this.props.innerRef && typeof this.props.innerRef !== 'function' ? this.props.innerRef : this.el).current;

  render() {
    const { description, innerRef } = this.props;
    let placeholderStyle;
    if (description.length > 0) {
      placeholderStyle = { display: 'none' }
    }

    const ref = typeof innerRef === 'function' ? (current: HTMLElement) => {
      innerRef(current)
      this.el.current = current
    } : innerRef || this.el;

    return (
      <div className='description-editor contenteditable' ref={ref} contentEditable={true} onInput={this.emitChange} onBlur={this.props.onBlur || this.emitChange} dangerouslySetInnerHTML={{ __html: description }}></div>
    )
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.description) !== normalizeHtml(el.innerHTML)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.description !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.description;
    }
    replaceCaret(el);
  }

  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = this.getEl();
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
    description: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    innerRef: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ])
  }
}

export interface Props {
  description: string,
  onChange?: Function,
  onBlur?: Function,
  innerRef?: React.RefObject<HTMLElement> | Function
}

export default DescriptionEditor;
