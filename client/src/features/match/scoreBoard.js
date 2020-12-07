import React from 'react';
import {useSelector} from 'react-redux';
import {selectMatch} from './matchSlice';

export default function ScoreBoard() {
  const match = useSelector(selectMatch).detail;
  const status = match.status || {};

  return (
    <div className="container-fluid">
      <div>
        {match.blueTeamName}
      </div>
      <div>
        {status.type} -
        {parseInt(status.remaining / 1000)}s
      </div>
      <div>
        turn: {match.turn}
      </div>
      <div>
        {match.redTeamName}
      </div>
    </div>
  );
}
