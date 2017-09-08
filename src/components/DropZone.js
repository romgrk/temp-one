import React, { Component } from 'react';
import cx from 'classname';

class DropZone extends Component {
  constructor(props) {
    super(props)
    this.onChange    = this.onChange.bind(this)
    this.onDrag      = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd   = this.onDragEnd.bind(this)
    this.onDragOver  = this.onDragOver.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop      = this.onDrop.bind(this)

    this.state = {
      over: false
    }
  }

  setDragOver(value) {
    this.setState({ over: value })
  }

  componentDidMount() {
    if (!('attachToDocument' in this.props))
      return
    this.isAttachedToDocument = true
    document.addEventListener('drag',      this.onDrag)
    document.addEventListener('dragstart', this.onDragStart)
    document.addEventListener('dragend',   this.onDragEnd)
    document.addEventListener('dragover',  this.onDragOver)
    document.addEventListener('dragenter', this.onDragEnter)
    document.addEventListener('dragleave', this.onDragLeave)
    document.addEventListener('drop',      this.onDrop)
  }

  componentWillUnmount() {
    if (!this.isAttachedToDocument)
      return
    document.removeEventListener('drag',      this.onDrag)
    document.removeEventListener('dragstart', this.onDragStart)
    document.removeEventListener('dragend',   this.onDragEnd)
    document.removeEventListener('dragover',  this.onDragOver)
    document.removeEventListener('dragenter', this.onDragEnter)
    document.removeEventListener('dragleave', this.onDragLeave)
    document.removeEventListener('drop',      this.onDrop)
  }

  onDrag(event) {
    event.preventDefault()
    event.stopPropagation()
  }
  onDragStart(event) {
    event.preventDefault()
    event.stopPropagation()
  }
  onDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(true)
  }
  onDragEnter(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(true)
  }
  onDragEnd(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)
  }
  onDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)
  }
  onDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)

    if (this.props.onChange)
      this.props.onChange(event.dataTransfer.items[0].getAsFile())
  }

  onChange(event) {
    const files = event.target.files
    if (files.length && this.props.onChange)
      this.props.onChange(files[0])
  }


  render() {
    const { className } = this.props

    const mergedClassName = cx('DropZone', {
      'DropZone--drag-over': this.state.over
    }, className)

    return (
      <div className={mergedClassName}
        onChange={this.onChange}
        onDrag={this.onDrag}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <div className='DropZone__border'>
          <h3 className='DropZone__content'>
            Drop file
          </h3>
        </div>
      </div>
    );
  }
}

export default DropZone;
