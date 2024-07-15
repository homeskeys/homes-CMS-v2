/**
 *
 * UpdateMotel
 *
 */

import { Avatar } from '@material-ui/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Alert, Button, Col, Container, Row } from 'reactstrap';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as Yup from 'yup';
import axios from 'axios';
import InputForm from '../../components/InputForm';
import InputLocation from '../../components/InputLocation';
// import { getMotel } from '../Motel/actions';
import { getMotelInfor } from '../Motel/actions';
import { changeStoreData, postImg, putMotel } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import { urlLink } from '../../helper/route';
import makeSelectUpdateMotel from './selectors';
import './style.scss';

const validateForm = Yup.object().shape({
  name: Yup.string().required(<FormattedMessage {...messages.errorName} />),
  address: Yup.string().required(
    <FormattedMessage {...messages.errorAddress} />,
  ),
  minPrice: Yup.string().required(
    <FormattedMessage {...messages.errorMinPrice} />,
  ),
  maxPrice: Yup.string().required(
    <FormattedMessage {...messages.errorMaxPrice} />,
  ),
  contactPhone: Yup.string().required(
    <FormattedMessage {...messages.errorContactPhone} />,
  ),
  description: Yup.string().required(
    <FormattedMessage {...messages.errorDescription} />,
  ),
  electricityPrice: Yup.string().required(
    <FormattedMessage {...messages.erroreLectricityPrice} />,
  ),
  waterPrice: Yup.string().required(
    <FormattedMessage {...messages.errorWaterPrice} />,
  ),
  wifiPrice: Yup.string().required(
    <FormattedMessage {...messages.errorwifiPrice} />,
  ),
  wifiPriceN: Yup.string().required(
    <FormattedMessage {...messages.errorwifiPriceN} />,
  ),
  garbagePrice: Yup.string().required(
    <FormattedMessage {...messages.errorgarbagePrice} />,
  ),
});

export function UpdateMotel(props) {
  useInjectReducer({ key: 'updateMotel', reducer });
  useInjectSaga({ key: 'updateMotel', saga });
  const { id } = useParams();
  useInjectReducer({ key: 'editMotel', reducer });
  useInjectSaga({ key: 'editMotel', saga });
  useEffect(() => {
    // props.getMotel(id);
    props.getMotelInfor(id);
  }, []);

  const { motel = {} } = props.updateMotel;

  const {
    name = '',
    contactPhone = '',
    minPrice = 0,
    maxPrice = 0,
    address = '',
    description = '',
    electricityPrice = 0,
    waterPrice = 0,
    garbagePrice = 0,
    wifiPrice = 0,
    wifiPriceN = 0,
    images = [],
  } = motel;

  console.log("motellllllll", motel);

  const TenMegaBytes = 10 * 1024 * 1024;
  const [submitAction, setSubmitAction] = useState(false);
  const [imageAction, seImageAction] = useState('');
  const [arrayRemoveImg, setArrayRemoveImg] = useState([]);
  const [arrayImg, setArrayImg] = useState(images || []);
  const [arrayCallImg, setArrayCallImg] = useState([]);


  const handleFileInputChange = e => {
    const dataFile = e.target.files;
    setArrayCallImg([]);
    let newArr = arrayCallImg;
    setSubmitAction(true);
    // const abcfile = e.target.files[0];
    // check mb file size
    for (let i = 0; i < dataFile.length; i++) {
      if (dataFile[i].size <= TenMegaBytes) {
        setSubmitAction(false);
        const formData = new FormData();
        formData.append('file', dataFile[i]);
        try {
          const data = {
            id,
            formData,
          };
          seImageAction(data);
          newArr.push(data);
          // apiPostImg(data);
        } catch (error) { }
      }
    }

    setArrayCallImg(newArr);
  };

  const handleCallImages = () => {
    const n = arrayCallImg.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < n; i++) {
      apiPostImg(arrayCallImg[i]);
    }
  };

  const apiPostImg = async payload => {
    // eslint-disable-next-line no-shadow
    const { id, formData } = payload;
    const requestUrl = `${urlLink.api.serverUrl +
      urlLink.api.motelDetail}img/${id}`;

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.post(requestUrl, formData, config);
      if (response.data.data.images) {
        return response.data.data.images.imageUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveClick = (value, index) => {
    const newArr = arrayRemoveImg;
    newArr.push(value);
    setArrayRemoveImg(newArr);
    setArrayImg(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  return (
    <div className="update-motel-wrapper">
      <Helmet>
        <title>UpdateMotel</title>
        <meta name="description" content="Description of UpdateMotel" />
      </Helmet>
      <Container>
        <Formik
          // ref={ref => (this.formik = ref)}
          initialValues={{
            name,
            contactPhone,
            minPrice,
            maxPrice,
            electricityPrice,
            waterPrice,
            garbagePrice,
            wifiPrice,
            wifiPriceN,
            description,
            address,
            imagesView: arrayImg,
            removedImg: arrayRemoveImg,
          }}
          enableReinitialize
          validationSchema={validateForm}
          onSubmit={evt => {
            // uploadImage(previewSource);
            const temp = { ...evt, id, imageAction };
            handleCallImages();
            props.putMotel(id, temp);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  <div className='title'>
                    <FormattedMessage {...messages.UpdateMotel} />
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <InputForm
                    label={<FormattedMessage {...messages.electricityPrice} />}
                    type="number"
                    min={0}
                    placeholder="VND"
                    name="electricityPrice"
                    autoComplete="description"
                    value={values.electricityPrice}
                    touched={touched.electricityPrice}
                    error={errors.electricityPrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <InputForm
                    label={<FormattedMessage {...messages.waterPrice} />}
                    type="number"
                    min={0}
                    placeholder="VND"
                    name="waterPrice"
                    autoComplete="waterPrice"
                    value={values.waterPrice}
                    touched={touched.waterPrice}
                    error={errors.waterPrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <InputForm
                    label={<FormattedMessage {...messages.wifiPrice} />}
                    type="number"
                    min={0}
                    placeholder="VND"
                    name="wifiPrice"
                    autoComplete="wifiPrice"
                    value={values.wifiPrice}
                    touched={touched.wifiPrice}
                    error={errors.wifiPrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <InputForm
                    label={<FormattedMessage {...messages.wifiPriceN} />}
                    type="number"
                    min={0}
                    placeholder="VND"
                    name="wifiPriceN"
                    autoComplete="wifiPriceN"
                    value={values.wifiPriceN}
                    touched={touched.wifiPriceN}
                    error={errors.wifiPriceN}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <InputForm
                    label={<FormattedMessage {...messages.garbagePrice} />}
                    type="number"
                    min={0}
                    placeholder="VND"
                    name="garbagePrice"
                    autoComplete="garbagePrice"
                    value={values.garbagePrice}
                    touched={touched.garbagePrice}
                    error={errors.garbagePrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <InputForm
                    type="number"
                    label={<FormattedMessage {...messages.minPrice} />}
                    min={0}
                    name="minPrice"
                    value={values.minPrice}
                    touched={touched.minPrice}
                    error={errors.minPrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={6}>
                  <InputForm
                    className="input-price"
                    type="number"
                    label={<FormattedMessage {...messages.maxPrice} />}
                    min={0}
                    name="maxPrice"
                    value={values.maxPrice}
                    touched={touched.maxPrice}
                    error={errors.maxPrice}
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                  />
                </Col>
              </Row>
              {
                <FormattedMessage {...messages.enterDescription}>
                  {msg => (
                    <InputForm
                      type="textarea"
                      label={msg}
                      placeholder={msg}
                      name="description"
                      autoComplete="description"
                      value={values.description}
                      touched={touched.description}
                      error={errors.description}
                      onChange={evt => {
                        handleChange(evt);
                      }}
                      onBlur={handleBlur}
                    />
                  )}
                </FormattedMessage>
              }
              <Row>
                <Col xs={6}>
                  {
                    <FormattedMessage {...messages.EnterNumberPhone}>
                      {msg => (
                        <InputForm
                          label={msg}
                          placeholder={msg}
                          name="contactPhone"
                          autoComplete="contactPhone"
                          value={values.contactPhone}
                          touched={touched.contactPhone}
                          error={errors.contactPhone}
                          onChange={evt => {
                            handleChange(evt);
                          }}
                          onBlur={handleBlur}
                        />
                      )}
                    </FormattedMessage>
                  }
                </Col>
                <Col xs={6}>
                  {
                    <FormattedMessage {...messages.enterMotelName}>
                      {msg => (
                        <InputForm
                          label={msg}
                          placeholder={msg}
                          name="name"
                          autoComplete="name"
                          value={values.name}
                          touched={touched.name}
                          error={errors.name}
                          onChange={evt => {
                            handleChange(evt);
                          }}
                          onBlur={handleBlur}
                        />
                      )}
                    </FormattedMessage>
                  }
                </Col>
              </Row>

              {
                <FormattedMessage {...messages.Address}>
                  {msg => (
                    <InputLocation
                      label={msg}
                      placeholder={msg}
                      name="address"
                      value={values.address.address}
                      autoComplete="address"
                      touched={touched.address}
                      error={errors.address}
                      // onSelect={address => {
                      // 	setFieldValue('address', address.formatted_address);
                      // }}
                      onChange={evt => {
                        handleChange(evt);
                      }}
                      onBlur={handleBlur}
                    />
                  )}
                </FormattedMessage>
              }
              {/* <Row>
                {values.imagesView.length > 0 &&
                  values.imagesView.map((value, index) => (
                    <Col xs={6} md={3} className="text-center">
                      <Avatar
                        key={index}
                        style={{
                          width: '100%',
                          height: '200px',
                          margin: '10px auto',
                        }}
                        variant="square"
                        alt="Avatar"
                        src={value}
                      />
                    </Col>
                  ))}
              </Row> */}

              <Row>
                {values.imagesView.length > 0 &&
                  values.imagesView.map((value, index) => (
                    <Col xs={6} md={3} className="text-center">
                      <Avatar
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={{
                          width: '100%',
                          height: '200px',
                          margin: '10px auto',
                          position: 'relative',
                        }}
                        variant="square"
                        alt="Avatar"
                        src={value}
                      />
                      <Button
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '15px',
                        }}
                        className="remove-button"
                        onClick={() => {
                          handleRemoveClick(value, index);
                        }}
                        color="primary"
                      >
                        X
                      </Button>
                    </Col>
                  ))}
              </Row>

              <Row>
                <Col xs={6}>
                  <input
                    type="file"
                    id="fileupload"
                    accept=".png, .jpg"
                    multiple="multiple"
                    onChange={e => {
                      handleFileInputChange(e);
                    }}
                  />
                  {submitAction === true ? (
                    <Alert color="danger" className="mt-3">
                      {<FormattedMessage {...messages.SizeImage} />}
                    </Alert>
                  ) : (
                    ''
                  )}
                </Col>

                <Button
                  color="primary"
                  className="btn-block mt-3"
                  type="submit"
                >
                  {<FormattedMessage {...messages.Update} />}
                </Button>
              </Row>
            </form>
          )}
        </Formik>
      </Container>
      {/* <SuccessPopup
				content={content}
				visible={showSuccessPopup}
				toggle={() => {
					props.changeStoreData('showSuccessPopup', !showSuccessPopup);
				}}
			/> */}
    </div>
  );
}

UpdateMotel.propTypes = {
  dispatch: PropTypes.func,
  changeStoreData: PropTypes.func,
  putMotel: PropTypes.func,
  postImg: PropTypes.func,
};

// const uploadImage = async (base64EncodedImage) => {

// 	const requestUrl = urlLink.api.serverUrl + urlLink.api.uploading;
// 	try {
// 		await fetch(`${requestUrl}`, {
// 			method: 'POST',
// 			body: JSON.stringify({ data: base64EncodedImage }),
// 			headers: { 'Content-Type': 'application/json' }
// 		})
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

const mapStateToProps = createStructuredSelector({
  updateMotel: makeSelectUpdateMotel(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMotelInfor: id => {
      dispatch(getMotelInfor(id));
    },
    putMotel: (id, data) => {
      dispatch(putMotel(id, data));
    },
    postImg: (id, data) => {
      dispatch(postImg(id, data));
    },
    changeStoreData: (key, value) => {
      dispatch(changeStoreData(key, value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(UpdateMotel);
