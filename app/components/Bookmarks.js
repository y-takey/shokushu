import _ from 'lodash';
import React, { Component } from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Color from 'material-ui/lib/styles/colors'
import { mmss } from '../utils/formatter';

const style = {
  width: 300
  // color: Color.white,
  // backgroundColor: Color.lightBlue600
}

export default class Bookmarks extends Component {
  render() {
    const { bookmarks, goBookmark, removeBookmark } = this.props
    return (
      <List subheader="Bookmarks" insetSubheader={false} style={ style }>
        {bookmarks.map( (bookmark) => {
          return(
            <ListItem
              key={bookmark}
              leftAvatar={<Avatar icon={<i className="fa fa-bookmark" />} />}
              rightIcon={<i className="fa fa-remove" onClick={ (e) => removeBookmark(e, bookmark) } />}
              primaryText={mmss(bookmark)}
              onClick={ () => goBookmark(bookmark) }
            />
          )
        })}
      </List>
    );
  }
}
