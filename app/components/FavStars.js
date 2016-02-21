import _ from 'lodash';
import React, { Component } from 'react';
import IconButton from 'material-ui/lib/icon-button';

const style= {
  fontSize: 15,
  paddingLeft: 0,
  width: 20
}

export default class FavStars extends Component {

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { fav, onClick } = this.props
    return (
      <div>
        {_.times(5, (i) => {
          return (
            <IconButton key={i} onClick={ (e) => { this.stopPropagation(e); onClick(i)} } style={ style } className="fav-star">
              <i className={fav > i ? "fa fa-star" : "fa fa-star-o"} />
            </IconButton>
          )
        })}
      </div>
    );
  }
}
