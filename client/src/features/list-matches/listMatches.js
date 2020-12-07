/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadAllMatches, selectListMatches} from './listMatchesSlice';
import moment from 'moment';
import 'moment-timezone';
import {Link} from 'react-router-dom';


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
              <th></th>
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
      <td>{moment(data.startedAtUnixTime).
        tz('Asia/Ho_Chi_Minh').
        format('D/M/YYYY H:mm:ss')
      }</td>
      <td>{data.agentsNum}</td>
      <td>{`Interval: ${parseInt(data.intervalMillis / 1000)}s;
            Turn: ${parseInt(data.turnMillis / 1000)}s`}</td>
      <td>
        <Link
          to={`/matches/${data.code}`}
          className="btn btn-outline-primary btn-sm">
          <i className="fal fa-eye"></i>
        </Link>
      </td>
    </tr>
  );
};

export default ListMatches;
