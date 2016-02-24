import _ from 'lodash';
import React, { Component } from 'react';
import IconButton from 'material-ui/lib/icon-button';
import MaterialColor from 'material-ui/lib/styles/colors'

const style= {
  fontSize: 15,
  paddingLeft: 0,
  paddingTop: 4,
  paddingBottom: 4,
  width: 20,
  height: 24,
  color: MaterialColor.pink300
}

export default class FavStars extends Component {

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { fav, onClick } = this.props
    return (
      <span>
        {_.times(5, (i) => {
          return (
            <IconButton key={i} onClick={ (e) => { this.stopPropagation(e); onClick(i)} } style={ style } className="fav-star">
              <i className={fav > i ? "fa fa-star" : "fa fa-star-o"} />
            </IconButton>
          )
        })}
      </span>
    );
  }
}
