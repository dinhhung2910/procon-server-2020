import React, {Fragment, useState} from 'react';
import ReactHelmet from 'react-helmet';
import ListMatches from '../../features/list-matches/listMatches';
import {Modal} from 'react-bootstrap';
import CreateMatch from '../../features/list-matches/createMatch';
import {useDispatch} from 'react-redux';
import {loadAllMatches} from '../../features/list-matches/listMatchesSlice';

function Matches() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dispatch = useDispatch();
  const refresh = () => {
    dispatch(loadAllMatches());
  };
  return (
    <Fragment>
      <ReactHelmet>
        <title>List matches</title>
      </ReactHelmet>
      <div className="container-fluid">
        {/* LEGEND */}
        <div className="row mt-3">
          <div className="col-md-6">
            <legend>List of matches</legend>
          </div>
          <div className="col-md-6 flex-right">
            <a className="btn btn-default-btn-xs btn-primary mr-1"
              onClick={() => refresh()}>
              <i className="far fa-sync"></i>
              {'  Refresh'}
            </a>
            <a className="btn btn-default-btn-xs btn-success"
              onClick={() => setShowCreateModal(true)}>
              <i className="far fa-plus"></i>
              {'  New'}
            </a>
          </div>
        </div>
        <hr className="mt-0 mb-4" style={{width: '100%'}}></hr>
        <ListMatches />
        {/* MODAL ADD */}
        <Modal
          size="lg"
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Create match
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateMatch
              onSuccess={() => setShowCreateModal(false)}/>
          </Modal.Body>
        </Modal>

      </div>
    </Fragment>
  );
}

export default Matches;
