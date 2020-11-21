import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import ScoreBoard from './scoreBoard';

function MatchDetail(props) {
  return (
    <Fragment>
      <div>
        <ScoreBoard />
      </div>
    </Fragment>
  );
}

MatchDetail.propTypes = {
  'match': PropTypes.object.isRequired,
  'match.params.code': PropTypes.number,
};
export default MatchDetail;
