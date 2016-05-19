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
  detail() {
    const { upadter, file } = this.props;
    let tags = _.map(file.tags, "text");
    let viewingInfo = " -";
    if (file.viewing_num) {
      viewingInfo = `${file.viewing_num} (${file.last_viewed_at})`
    }

    return [
      <FavStars key={1} fav={file.fav} onClick={ (i) => {} } />,
      "  ",
      <i key={2} className="fa fa-fw fa-plus" />,
      file.registered_at,
      "  ",
      <i key={3} className="fa fa-fw fa-play" />,
      viewingInfo,
      "  ",
      <TagLabels key={4} tags={tags} />
    ]
  }

  render() {
    const { index, file } = this.props

    return (
      <ListItem
        leftAvatar={<Avatar style={ avatarStyle }>{index + 1}</Avatar>}
        primaryText={<Link to={`/viewer/${file.name}`} state={ { file: file } } style={ fileStyle } >{file.name}</Link>}
        secondaryText={this.detail()}
        secondaryTextLines={2}
        onClick={ (e) => this.props.shower(index) }
        innerDivStyle={ itemStyle }
      />
    );
  }
}
