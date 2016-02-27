import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Color from 'material-ui/lib/styles/colors'
import TagLabels from './TagLabels';
import FavStars from './FavStars';

const itemStyle = {
  paddingTop: 10,
  paddingBottom: 0,
  borderBottom: "1px solid " + Color.grey400
}

const avatarStyle = {
  fontSize: 14
}

const fileStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: Color.lightBlue900
}

export default class Item extends Component {
  render() {
    const { index, file } = this.props
    let tags = _.map(file.tags, "text");

    return (
      <ListItem
        leftAvatar={<Avatar style={ avatarStyle }>{index + 1}</Avatar>}
        primaryText={<Link to={`/viewer/${file.name}`} state={ { file: file } } style={ fileStyle } >{file.name}</Link>}
        secondaryText={[
          <FavStars key={1} fav={file.fav} onClick={ (i) => { this.props.updater(file.name, i + 1)} } />,
          " ", file.registered_at,
          <TagLabels key={2} tags={tags} />
        ]}
        secondaryTextLines={2}
        onClick={ (e) => this.props.shower(index) }
        innerDivStyle={ itemStyle }
      />
    );
  }
}
