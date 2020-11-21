import React from 'react';
import {useSelector} from 'react-redux';
import {selectMatch} from './matchSlice';

export default function ScoreBoard() {
  const match = useSelector(selectMatch).detail;

  return (
    <div className="container-fluid">
      <div>
        {match.blueTeamName}
      </div>
      <div>
        {match.redTeamName}
      </div>
    </div>
  );
}
