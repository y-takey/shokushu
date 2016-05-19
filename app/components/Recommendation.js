import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Color from 'material-ui/lib/styles/colors'

const style = {
  width: 300
  // color: Color.white,
  // backgroundColor: Color.lightBlue600
}

const fileStyle = {
  // fontSize: 18,
  // fontWeight: "bold",
  // color: Color.lightBlue900
}

export default class Recommendation extends Component {
  render() {
    const { recommendation } = this.props
    return (
      <List subheader="Recommendation" insetSubheader={false} style={ style }>
        {recommendation.map( (rec) => {
          return(
            <ListItem
              key={`recommend-${rec.name}`}
              leftAvatar={<Avatar icon={<i className="fa fa-heart" />} />}
              primaryText={<Link to={`/viewer/${rec.name}`} state={ { file: rec } } style={ fileStyle } >{rec.name}</Link>}
            />
          )
        })}
      </List>
    );
  }
}
