import _ from 'lodash';
import React, { Component } from 'react';

export default class TagLabels extends Component {

  render() {
    const { tags, activeTag, handler } = this.props
    return (
      <div>
        {_.map(tags, (t) => {
          let active = activeTag === t ? " active" : ""
          return <span className={`tag-label${active}`} key={t} onClick={ () => handler(t) }><i className={`fa fa-tag`} /> {t}</span>
        })}
      </div>
    );
  }
}
