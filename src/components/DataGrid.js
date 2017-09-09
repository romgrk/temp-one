import React, { Component } from 'react';
import { render } from 'react-dom';
import { ap, map, all, set, view, over, lensPath, range } from 'ramda';


/*
 * Number of cells after the edge of the visible area to render.
 */
const CELLS_AROUND = 1

/*
 * Default dimensions of the different parts of the interface
 */
const DEFAULT_SIZES = {
    labelWidth: 100
  , labelHeight: 30
  , width:  250
  , height: 40
}

export default class DataGrid extends Component {
  constructor() {
    super()

    this.onScroll = this.onScroll.bind(this)
    this.onBlurInput = this.onBlurInput.bind(this)
    this.onKeyDownInput = this.onKeyDownInput.bind(this)

    this.updateVisibleDimensions = debounce(150, this.updateVisibleDimensions.bind(this))

    const sizes = Object.assign({}, DEFAULT_SIZES)
    sizes.offsetWidth  = sizes.labelWidth
    sizes.offsetHeight = sizes.labelHeight

    this.state = {
        visibleWidth: 500
      , visibleHeight: 500
      , scrollTop: 0
      , scrollLeft: 0
      , showHeaders: true
      , showLabels: false
      , rotateHeaders: false
      , sizes: sizes
      , focusedCell: { row: -1, column: -1 }
    }
  }

  updateVisibleDimensions() {
    this.setState({
        visibleWidth: this.scrollArea.clientWidth
      , visibleHeight: this.scrollArea.clientHeight
    })
  }

  blur() {
    this.focus(-1, -1)
  }

  focus(row, column) {
    this.setState({ focusedCell: { row, column } })
  }

  setFocusedCellValue(newValue) {
    const { focusedCell } = this.state
    const { setCellValue } = this.props
    setCellValue(focusedCell.row, focusedCell.column, newValue)
  }

  onScroll(ev) {
    this.setState({
      scrollTop: ev.target.scrollTop,
      scrollLeft: ev.target.scrollLeft
    })
  }

  componentDidMount() {
    this.updateVisibleDimensions()
    window.addEventListener('resize', this.updateVisibleDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVisibleDimensions)
  }

  onBlurInput(ev) {
    this.blur()
  }

  onKeyDownInput(ev) {
    console.log(ev)
    if (ev.which === 13 /* Enter */) {
      ev.preventDefault()
      this.setFocusedCellValue(ev.target.value)
      this.blur()
    }

    if (ev.which === 9 /* Tab */) {
      ev.preventDefault()
      const { focusedCell } = this.state
      const { columns } = this.props

      this.setFocusedCellValue(ev.target.value)

      if (!ev.shiftKey) {
        const jumpToNextRow = focusedCell.column === columns.length - 1

        const nextRow    = jumpToNextRow ? focusedCell.row + 1 : focusedCell.row
        const nextColumn = jumpToNextRow ? 0 : focusedCell.column + 1

        this.focus(nextRow, nextColumn)
      } else {
        const jumpToPreviousRow = focusedCell.column === 0

        const nextRow    = jumpToPreviousRow ? focusedCell.row - 1 : focusedCell.row
        const nextColumn = jumpToPreviousRow ? columns.length - 1 : focusedCell.column - 1

        this.focus(nextRow, nextColumn)
      }
    }

    if (ev.which === 38 /* ArrowUp */) {
      ev.preventDefault()
      const { focusedCell } = this.state
      const { rows } = this.props

      this.setFocusedCellValue(ev.target.value)

      const jumpToLastRow = focusedCell.row === 0

      const nextRow    = jumpToLastRow ? rows.length - 1 : focusedCell.row - 1
      const nextColumn = focusedCell.column

      this.focus(nextRow, nextColumn)
    }

    if (ev.which === 40 /* ArrowDown */) {
      ev.preventDefault()
      const { focusedCell } = this.state
      const { rows } = this.props

      this.setFocusedCellValue(ev.target.value)

      const jumpToFirstRow = focusedCell.row === rows.length - 1

      const nextRow    = jumpToFirstRow ? 0 : focusedCell.row + 1
      const nextColumn = focusedCell.column

      this.focus(nextRow, nextColumn)
    }
  }

  onFocusCell(rowIndex, columnIndex) {
    this.setState({
      focusedCell: { row: rowIndex, column: columnIndex }
    })
  }

  getSizes() {
    const {
        sizes
      , showLabels
      , showHeaders
    } = this.state

    return {
        ...sizes
      , offsetWidth: showLabels ? sizes.offsetWidth : 0
      , offsetHeight: showHeaders ? sizes.offsetHeight : 0
    }
  }

  render() {
    const {
        visibleWidth
      , visibleHeight
      , scrollTop
      , scrollLeft
      , showLabels
      , showHeaders
      , rotateHeaders
      , focusedCell
    } = this.state

    const {
        rows
      , columns
      , getCellValue
    } = this.props

    const sizes = this.getSizes()

    const firstRowIndex = getFirstVisibleRowIndex(scrollTop, sizes)
    const lastRowIndex =
      Math.min(
        rows.length,
        getLastVisibleRowIndex(scrollTop, visibleHeight, sizes))
    const firstColumnIndex = getFirstVisibleColumnIndex(scrollLeft, sizes)
    const lastColumnIndex =
      Math.min(
        columns.length,
        getLastVisibleColumnIndex(scrollLeft, visibleWidth, sizes))


    const visibleRows = rows.slice(firstRowIndex, lastRowIndex)
    const visibleColumnTitles = columns.slice(firstColumnIndex, lastColumnIndex)

    return (
      <div className='DataGrid' style={gridStyle(sizes)}>

        <div ref={ref => this.scrollArea = ref}
            className='DataGrid__scrollArea'
            style={scrollAreaStyle(sizes)}
            onScroll={this.onScroll} >

          <div className='DataGrid__filler'
            style={fillerStyle(rows.length, columns.length, sizes)} />

          {
            visibleRows.map((row, i) => {
              const rowIndex = firstRowIndex + i

              return (
                <div key={row.name}
                    className='Row'
                    style={rowStyle(rowIndex, sizes)} >
                  {
                    range(firstColumnIndex, lastColumnIndex).map((columnIndex) => {
                      const isFocused =
                           focusedCell.row === rowIndex
                        && focusedCell.column === columnIndex

                      if (!isFocused)
                        return (
                          <div key={columnIndex}
                              className='Cell'
                              style={cellStyle(rowIndex, columnIndex, sizes)}
                              onClick={() => this.onFocusCell(rowIndex, columnIndex)} >
                            <span className='text-ellipsis'>
                              { getCellValue(rowIndex, columnIndex, row) }
                            </span>
                          </div>
                        )

                      return (
                        <div key={columnIndex}
                            className='Cell Cell--focused'
                            style={cellStyle(rowIndex, columnIndex, sizes)} >
                          <span className='text-ellipsis'>
                            <input
                              type='text'
                              defaultValue={getCellValue(rowIndex, columnIndex, row)}
                              onBlur={this.onBlurInput}
                              onKeyDown={this.onKeyDownInput}
                              ref={ref => ref && (ref.focus(), ref.select())}
                            />
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>

        <div className='Columns'>
          {
            visibleColumnTitles.map((column, i) => {
              const columnIndex = firstColumnIndex + i
              return (
                <div key={columnIndex}
                    className={ 'Column__title ' + (rotateHeaders ? 'Column__title--rotated' : '') }
                    style={columnStyle(columnIndex, scrollLeft, rotateHeaders, sizes)}
                    onClick={() => this.onSelectColumn(columnIndex)}
                    title={ column.name }
                    >
                  <span className='text-ellipsis'>
                    { column.name }
                  </span>
                </div>
              )
            })
          }
        </div>

        <div className='Rows'>
        {
          showLabels && visibleRows.map((row, i) => {
            const rowIndex = firstRowIndex + i

            return (
              <span className='Row__title'
                  style={rowTitleStyle(scrollTop, rowIndex, sizes)}
                  onClick={() => this.onSelectRow(rowIndex)}>
                { row.name }
              </span>
            )
          })
        }
        </div>

      </div>
    )
  }
}

/* Helper functions */

function getFirstVisibleRowIndex(scrollTop, sizes) {
  const index = Math.floor((scrollTop - sizes.offsetHeight) / sizes.height)
  return Math.max(0, index - CELLS_AROUND)
}

function getLastVisibleRowIndex(scrollTop, visibleHeight, sizes) {
  return CELLS_AROUND + Math.ceil(
    (scrollTop - sizes.offsetHeight + visibleHeight) / sizes.height)
}

function getFirstVisibleColumnIndex(scrollLeft, sizes) {
  const index = Math.floor((scrollLeft - sizes.offsetWidth) / sizes.width)
  return Math.max(0, index - CELLS_AROUND)
}

function getLastVisibleColumnIndex(scrollLeft, visibleWidth, sizes) {
  return CELLS_AROUND + Math.ceil(
    (scrollLeft - sizes.offsetWidth + visibleWidth) / sizes.width)
}

function getMaximumColumns(rows) {
  return rows.reduce((max, row) => Math.max(max, row.columns.length), 0)
}

function getTop(i, sizes) {
  return i * sizes.height
}

function getLeft(i, sizes) {
  return sizes.offsetWidth + i * sizes.width
}

function debounce(delay, fn) {
  let timer
  let waiting
  return function() {
    if (timer)
      return !(waiting = true)
    fn.apply(null, arguments)
    timer = setTimeout(() =>
      (timer = null, waiting && (
        fn.apply(null, arguments), waiting = false)), delay)
  }
}

/* Style generation */

function gridStyle(sizes) {
  return {
    fontSize: `${Math.min(sizes.width, sizes.height) * 0.5}px`
  }
}

function fillerStyle(rows, columns, sizes) {
  return {
    width: `${getLeft(columns, sizes)}px`,
    height: `${getTop(rows, sizes)}px`,
    backgroundPosition: `${sizes.offsetWidth}px 0px`,
    backgroundSize: `${sizes.width}px ${sizes.height}px`,
  }
}

function scrollAreaStyle(sizes) {
  return {
    marginTop: `${sizes.offsetHeight}px`,
    marginLeft: `${sizes.offsetWidth}px`,
  }
}

function rowStyle(rowIndex, sizes) {
  return {
    transform:
      `translate(0px, ${getTop(rowIndex, sizes)}px)`
  }
}

function rowTitleStyle(scrollTop, rowIndex, sizes) {
  return {
    width: `${sizes.offsetWidth}px`,
    height: `${sizes.height}px`,
    transform:
      `translate(0px, ${sizes.offsetHeight + getTop(rowIndex, sizes) - scrollTop}px)`
  }
}

function columnStyle(columnIndex, scrollLeft, rotateHeaders, sizes) {
  if (rotateHeaders)
    return {
      width: `${sizes.offsetHeight}px`, //----> Inversed because of rotation
      height: `${sizes.width}px`, //-----------^
      borderBottom: 'none',
      transformOrigin: '0 0',
      transform:
        `translate(${getLeft(columnIndex, sizes) - scrollLeft}px, ${sizes.offsetHeight}px)
        rotate(-90deg)`
    }

  return {
    width: `${sizes.width}px`,
    height: `${sizes.offsetHeight}px`,
    transform:
      `translate(${getLeft(columnIndex, sizes) - scrollLeft}px, 0px)`
  }
}

function cellStyle(rowIndex, columnIndex, sizes) {
  return {
    width: `${sizes.width}px`,
    height: `${sizes.height}px`,
    transform:
      `translate(${getLeft(columnIndex, sizes)}px, 0px)`
  }
}


/* Test data generation */

function createRows(rows, cols) {
  return Array(rows).fill(0).map((_, i) =>
    ({ name: `Row ${i}`, columns: createColumns(cols) }))
}

function createColumns(n) {
  return Array(n).fill(0)
    .map(_ => ({ count: random(), color: color(), selected: false }))
}

function random() {
  return Math.random() > 0.10 ? 0 : ~~(Math.random() * 20)
}

function color() {
  return [
      'blueviolet'
    , 'chartreuse'
    , 'crimson'
    , 'darkorange'
    , 'greenyellow'
    , 'lightsalmon'
    , 'mediumspringgreen'
    , 'olive'
    , 'yellow'
  ][~~(Math.random() * 9)]
}

function createColumnTitles(n) {
  return Array(n).fill(1)
    .map((_, i)=> ({ name: `Column ${i}`, group: `Group ${~~(Math.random() * 80)}` }))
    .sort((a, b) => a.group.localeCompare(b.group))
}
