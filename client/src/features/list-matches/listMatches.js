/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadAllMatches, selectListMatches} from './listMatchesSlice';
import moment from 'moment';

function ListMatches() {
  const matches = useSelector(selectListMatches);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!matches.loaded) {
      dispatch(loadAllMatches());
    }
  }, []);

  return (
    <div className="col-md-12">

      <form>
        <table className="table table-bordered table-condensed table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Red team</th>
              <th>Blue team</th>
              <th>Turns</th>
              <th>Start at</th>
              <th>Agents num</th>
              <th>Turn time</th>
            </tr>
          </thead>
          <tbody id="form-list-client-body">
            {matches.list.map((item) => (<Row data={item} key={item.code}/>))}
          </tbody>
        </table>
      </form>
    </div>
  );
}

const Row = ({data}) => {
  return (
    <tr>
      <td>{data.code}</td>
      <td>{data.redTeamName} </td>
      <td>{data.blueTeamName}</td>
      <td>{data.maxTurn}</td>
      <td>{moment(data.startedAtUnixTime).format('D/M/YYYY H:m:s')}</td>
      <td>{data.agentsNum}</td>
      <td>{`Interval: ${parseInt(data.intervalMillis / 1000)}s;
            Turn: ${parseInt(data.turnMillis / 1000)}s`}</td>
    </tr>
  );
};

export default ListMatches;
