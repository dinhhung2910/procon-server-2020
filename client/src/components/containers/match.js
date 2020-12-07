import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import ReactHelmet from 'react-helmet';
import MatchDetail from '../../features/match/match';
import {loadMatchByCode, selectMatch} from '../../features/match/matchSlice';

function Match(props) {
  const code = props.match.params.code;
  let loop = 0;
  const [counter, setCounter] = useState(0);
  const dispatch = useDispatch();
  const match = useSelector(selectMatch);

  /* refresh map each 400ms */
  useEffect(() => {
    const interval = setInterval(() => {
      loop++;
      setCounter(loop);
    }, 400);
    return (() => {
      clearInterval(interval);
    });
  }, []);

  useEffect(() => {
    if ( (match.code != code) ||
      (match.detail &&
      match.detail.status &&
      match.detail.status.type !== 'ended')) {
      dispatch(loadMatchByCode(code));
    }
  }, [counter]);

  return (
    <Fragment>
      <ReactHelmet>
        <title>{`Match ${match.code} |
          ${match.detail.blueTeamName} vs ${match.detail.redTeamName}`}
        </title>
      </ReactHelmet>
      <MatchDetail />
    </Fragment>
  );
}

Match.propTypes = {
  'match': PropTypes.object.isRequired,
  'match.params.code': PropTypes.number,
};
export default Match;
