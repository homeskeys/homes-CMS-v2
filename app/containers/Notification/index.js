/**
 *
 * Profile
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Button, Col, Row } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AddIcon from '@material-ui/icons/Add';
import ContactsIcon from '@material-ui/icons/Contacts';
import DeleteIcon from '@material-ui/icons/Delete';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PhoneIcon from '@material-ui/icons/Phone';
import RoomIcon from '@material-ui/icons/Room';
import TocIcon from '@material-ui/icons/Toc';
import ReportIcon from '@material-ui/icons/Report';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import localStore from 'local-storage';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { DataGrid } from '@mui/x-data-grid';
import AlertDialog from '../../components/AlertDialog/Loadable';
import PaperWrapper from '../../components/PaperWrapper/Loadable';
import SuccessPopup from '../../components/SuccessPopup';
import WarningPopup from '../../components/WarningPopup';
import Money from '../../helper/format';
import {
  changeStoreData,
  deleteJob,
  deleteMotel,
  getJobs,
  getMotelList,
  getProfile,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectProfile from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';
import axios from 'axios';
import localStoreService from 'local-storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Person from '@material-ui/icons/Person';
import { Home, LocalPhone } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    justifyContent: 'center',
    alignItems: 'center',
  },
  large: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
  input: {
    display: 'none',
  },
}));

export function Profile(props) {
  const classes = useStyles();
  useInjectReducer({ key: 'profile', reducer });
  useInjectSaga({ key: 'profile', saga });

  const currentUser = localStore.get('user') || {};
  const {
    _id = '',
    lastName = '',
    firstName = '',
    role = [],
    phoneNumber = {},
  } = currentUser;
  const history = useHistory();

  const {
    jobs = [],
    profile = {},
    showAlert = false,
    alert = {},
  } = props.profile;

  useEffect(() => {
    console.log('Check id: ', _id);
    props.getProfile(_id);
  }, [_id]);
  const { showSuccessPopup, showErrorPopup, showWarningPopup } = props.profile;
  const [id, setId] = useState('');
  let profileData = props.profile.profile || [];

  // Nếu profileData không phải là một mảng, chuyển nó thành một mảng
  if (!Array.isArray(profileData)) {
    profileData = [profileData];
  }

  // console.log('Check profile: ', profileData);

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Thời gian',
      width: 300,
    },
    {
      field: 'title',
      headerName: 'Tiêu đề',
      width: 300,
      editable: true,
    },
    {
      field: 'content',
      headerName: 'Nội dung thông báo',
      width: 700,
      editable: true,
    },
  ];

  // Loại bỏ các đối tượng không có _id
  const rows = profileData
    .filter(item => item && item._id)
    .map(item => ({
      id: item._id,
      title: item.title,
      content: item.content,
      createdAt: new Date(item.createdAt).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    }));

  return (
    <div className="user-profile-wrapper container">
      <Helmet>
        <title>Notification</title>
        <meta name="description" content="Description of Profile" />
      </Helmet>
      <div className="user-profile">
        <div className="notification-container">
          <div className="notification-title">Thông báo</div>

          {/* {Array.isArray(profileData) &&
            profileData.map((item, index) => (
              <div className="notification-content">
                <div className="notification-content-title">{item.title}</div>
                <div className="notification-content-content">
                  {item.content}
                </div>
              </div>
            ))} */}
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>

      <SuccessPopup
        visible={showSuccessPopup}
        content={<FormattedMessage {...messages.detelesuccess} />}
        toggle={() => {
          props.changeStoreData('showSuccessPopup', !showSuccessPopup);
        }}
      />
      <SuccessPopup
        visible={showErrorPopup}
        content={<FormattedMessage {...messages.errorMessage} />}
        toggle={() => {
          props.changeStoreData('showErrorPopup', !showErrorPopup);
        }}
      />
      <WarningPopup
        visible={showWarningPopup}
        content={<FormattedMessage {...messages.reallyMessage} />}
        callBack={() => props.deleteMotel(id)}
        toggle={() => {
          props.changeStoreData('showWarningPopup', false);
        }}
      />
      <AlertDialog
        open={showAlert}
        alert={alert}
        handleClose={() => {
          props.changeStoreData('showAlert', false);
        }}
      />
    </div>
  );
}

Profile.propTypes = {
  dispatch: PropTypes.func,
  getRoomList: PropTypes.func,
  deleteMotel: PropTypes.func,
  changeStoreData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProfile: id => {
      dispatch(getProfile(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Profile);
