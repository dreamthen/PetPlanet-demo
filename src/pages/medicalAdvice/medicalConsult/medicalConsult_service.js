import Tools from '../../../utils/petPlanetTools';
import {setMedicalConsultAttrValue} from './medicalConsult_action';
import * as constants from './constants';

/**
 * 获取咨询的问题领域列表
 * @returns {function(*)}
 */
function homeInfo() {
    return async (dispatch) => {
        return await Tools.request({
            url: 'cnslt/cnsltAreas',
            success: async (data, header) => {
                if (data) {
                    data.forEach((area, index) => {
                        area.checked = index === 0;
                    });
                }
                await dispatch(setMedicalConsultAttrValue({areaList: data}));
            },
            fail: res => {
                console.log(res);
            },
            complete: res => {
                console.log(res);
            }
        });
    }
}

/**
 * 医疗咨询上传图片
 */
function uploadImg({size = 0, value = '', key = 0, total = 0}) {
    const {count} = this;
    let {medicalConsultStore: {consultImages, uploadConsultImages}} = this.props;
    return (dispatch) => {
        return Tools.uploadFile({
            url: 'tinyStatics/uploadImg/v2',
            filePath: value.url,
            size,
            name: 'file',
            formData: {
                type: constants.uploadPrefix
            },
            success: (data, statusCode) => {
                if (statusCode === 200) {
                    consultImages.push(value);
                    uploadConsultImages.push(data);
                    const {length} = consultImages;
                    //最大上传列表数量随着上传图片的增加而减少
                    this.setState({
                        moveCount: count - length
                    });
                    //当上传显示的图片列表等于最大上传图片列表树立那个,则将添加按钮变消失
                    if (length >= count) {
                        this.setState({
                            showAddBtn: false
                        });
                    }
                    //延时800ms将上传图片loading消除
                    if (key >= total - 1) {
                        this.setState({
                            uploadLoading: false
                        });
                    }
                    dispatch(setMedicalConsultAttrValue({
                        consultImages,
                        uploadConsultImages
                    }));
                } else {
                    this.setState({
                        uploadLoading: false
                    });
                }
            },
            fail: (res) => {
                this.setState({
                    uploadLoading: false
                });
                console.log(res);
            },
            complete: (res) => {
                console.log(res);
            }
        });
    }
}

const medicalConsultAPI = {
    homeInfo,
    uploadImg
};

export default medicalConsultAPI;
