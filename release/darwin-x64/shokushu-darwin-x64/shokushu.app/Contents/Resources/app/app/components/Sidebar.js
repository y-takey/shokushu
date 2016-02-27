import _ from 'lodash';
import React, { Component } from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import Color from 'material-ui/lib/styles/colors'
import FavStars from './FavStars';

const NavStyle = {
  backgroundColor: Color.lightBlue900,
  padding: 10
}
const headerStyle = {
  color: Color.lightBlue300
}
const itemStyle = {
  color: Color.lightBlue50,
  lineHeight: "30px",
  paddingLeft: 10
}
const budgeStyle = {
  color: Color.white,
  margin: 0,
  marginTop: 3,
  backgroundColor: Color.lightBlue800,
  textAlign: "center",
  borderRadius: 8
}
const selectedItemStyle = _.assign({}, itemStyle, { backgroundColor: Color.lightBlue800 })

export default class Sidebar extends Component {
  sortItem() {
    let sorter = this.props.sorter;
    return ["name", "fav", "registered_at"].map((column) => {
      let icon = null;
      let style = itemStyle;
      if (sorter.colName === column) {
        style = selectedItemStyle
        icon = sorter.order === "asc" ? "caret-up" : "caret-down"
        icon = <i className={`fa fa-${icon}`} />
      }
      let item = <span>{column} {icon}</span>
      return <MenuItem
        primaryText={item}
        innerDivStyle={ style }
        key={column}
        value={column}
        onClick={ this.props.sortBy.bind(null, column) }
      />
    })
  }

  filterItem() {
    const { filter, filterBy, tags } = this.props;
    let items = []
    let favstar = <FavStars fav={filter.fav} onClick={ (i) => filterBy("fav", i + 1) } />
    items.push(<MenuItem key="_filter" children={favstar} innerDivStyle={ itemStyle } />)

    return items.concat(_.map(tags, (num, tag) => {
      let style = itemStyle;
      if (filter.tag === tag) {
        style = selectedItemStyle
      }
      return <MenuItem
        key={tag}
        primaryText={`#${tag}`}
        innerDivStyle={ style }
        rightIcon={<span style={ budgeStyle }>{ num }</span>}
        onClick={ filterBy.bind(null, "tag", tag) }
      />
    }))
  }

  render() {
    return (
      <LeftNav open={true} width={this.props.width} style={NavStyle} >
        <span style={headerStyle}><i className="fa fa-sort-amount-asc" /> SORT</span>
        { this.sortItem() }
        <Divider style={ {marginTop: 10, marginBottom: 10} } />
        <span style={headerStyle}><i className="fa fa-filter" /> FILTER</span>
        { this.filterItem() }
      </LeftNav>
    );
  }
}
