/**
 *
 * DueLabel
 *
 */

import React from 'react';
import { Label } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

export class DueLabel extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.forceUpdate();
  }


  render() {
    const dueDate = moment(this.props.dueDate);
    let dueColor = 'primary';
    if (dueDate.isBefore(moment())) {
      dueColor = 'danger';
    } else if (dueDate.isBefore(moment().add(1, 'hours'))) {
      dueColor = 'warning';
    } else if (dueDate.isBefore(moment().add(1, 'days'))) {
      dueColor = 'info';
    }

    return <Label className="pull-right" bsStyle={dueColor}>{dueDate.fromNow()}</Label>;
  }
}

DueLabel.propTypes = {
  dueDate: PropTypes.string,
};

export default DueLabel;
