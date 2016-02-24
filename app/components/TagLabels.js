import _ from 'lodash';
import React, { Component } from 'react';
import Color from 'material-ui/lib/styles/colors'

const tagStyle = {
  color: Color.white,
  backgroundColor: Color.lightBlue600
}

export default class TagLabels extends Component {
  render() {
    const { tags, activeTag, handler } = this.props
    return (
      <span>
        {_.map(tags, (t) => {
          let active = activeTag === t ? " active" : ""
          return <span className={`tag-label${active}`} style={tagStyle} key={t} onClick={ () => handler(t) }>
            <i className={`fa fa-tag`} />{t}
          </span>
        })}
      </span>
    );
  }
}
