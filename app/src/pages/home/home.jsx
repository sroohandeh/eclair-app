import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { readConfigRequest, readConfigResponse } from 'secure-electron-store';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

const Home = () => {
    const history = useHistory();
    const [showResultes, setShowResults] = useState(false);
    const [customerData, setCustomerData] = useState({});
    const [selectRule, setRule] = useState("");
    const [loyaltyRule, setLoyaltyRule] = useState([]);
    const [count, setCount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    let rule = loyaltyRule.find(obj => obj.RuleId == selectRule);

    const [token, setToken] = useState("");

    useEffect(() => {

        // Act on a successful message
        window.api.store.onReceive(readConfigResponse, function (arg) {
            if (arg.success) {
                let storeValue = `${arg.value}`;
                setToken(storeValue);
                rulesRequest(storeValue);
            }
        });
        window.api.store.send(readConfigRequest, "token");

        const rulesRequest = (token) => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch('https://next.dayaclub.com/api/v1/loyalty/rules', requestOptions).then(async response => {
                try {
                    const loyaltyResult = await response.json()
                    if (loyaltyResult.Succeeded) {
                        if (loyaltyResult.Payload.length) {
                            setLoyaltyRule(loyaltyResult.Payload)
                        } else {
                            toast.warn('قانون وفاداری تعریف نشده است')
                        }
                    } else {
                        console.log(error => console.log('error', error))
                    }
                } catch (error) {
                    console.error(error);
                    history.push('/');
                }
            })
        }
    }, []);

    const handleCustomer = () => {
        let customerNumber = phoneNumber.match(/\d+/g);
        if (phoneNumber == "") {
            toast.warn('لطفا یک مشتری وارد نمایید')
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://next.dayaclub.com/api/v1/customers/${customerNumber}/office`, requestOptions)
            .then(response => response.text())
            .then(result => {
                let customerResult = JSON.parse(result)
                if (customerResult.Succeeded) {
                    setCustomerData(customerResult.Payload)
                    setShowResults(true)
                } else {
                    toast.warn('مشتری یافت نشد');
                }
            })
            .catch(error => {
                console.log('error', error);
                history.push('/');
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (count === "") {
            toast.warn('تعداد تعیین نشده است')
            setIsDisable(false)
            return;
        }
        if (selectRule == "") {
            toast.warn('قانون وفاداری تعیین نشده است')
            setIsDisable(false)
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        var raw = JSON.stringify({
            CustomerId: customerData.Id,
            RuleId: rule.RuleId,
            Params: [{
                Key: rule.Params[0].Key,
                Value: count
            }]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch('https://next.dayaclub.com/api/v1/loyalty', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.Succeeded) {
                    setIsDisable(true)
                    toast.success("عملیات با موفقیت انجام شد", {
                        onClose: () => {
                            handleCancel();
                        }
                    });
                } else {
                    toast.warn("در هنگام اجرای عملیات خطایی رخ داده است")
                    setIsDisable(false)
                }
            })
            .catch(error => {
                toast.error('خطایی رخ داده است، لطفا مجددا تلاش کنید');
                console.log(error)
                history.push('/');
            });
    }

    const handleCancel = () => {
        setShowResults(false);
        setCustomerData({});
        setRule("");
        setPhoneNumber("");
        setCount("");
        setIsDisable(false);
    }

    return (
        <>
            <ToastContainer autoClose={6000} rtl={true} />
            <div className="d-flex justify-content-between align-items-center p-2 my-2 text-white shadow-sm" style={{ backgroundColor: '#73e5de' }}>
                <div className="text-gray-dark">
                    <small>ثبت پاداش وفاداری</small>
                </div>
                <a
                    className="text-white" style={{ textDecoration: 'none' }}
                    onClick={() => history.push('/')}>
                    <small>خروج</small>
                </a>
            </div>
            <div className="row" style={{ alignItems: 'center' }}>
                <div className="col-md-3 col-lg-6 order-md-1">
                    <div className="input-group input-group-sm mb-3 mr-2 mt-2">
                        <input type="text" className="form-control form-control-sm" placeholder="شماره موبایل/ شماره کارت مشتری " aria-label="" aria-describedby="basic-addon1" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                        <div className="input-group-prepend ml-4">
                            <button className="btn text-white" type="submit" style={{ backgroundColor: '#73e5de' }} onClick={handleCustomer}>جستجو</button>
                        </div>
                    </div>
                    <div style={{ display: showResultes ? "block" : "none" }}>
                        <div className="my-3 p-3 m-2 bg rounded box-shadow" style={{ backgroundColor: '#e0f9f8' }} >
                            <div className="media">
                                <svg className="bd-placeholder-img flex-shrink-0 me-2 ml-2 rounded" width="20" height="20"
                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                    preserveAspectRatio="xMidYMid slice" focusable="false">
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill='#73e5de' />
                                </svg>
                                <div className="media-body mb-0 small lh-125 d-flex justify-content-between align-items-center w-100">
                                    <div className="text-gray-dark">
                                        <b>نام کامل</b>
                                    </div>
                                    <span className='mt-0'>{customerData.FirstName} {customerData.LastName}</span>
                                </div>
                            </div>
                            <div className="media">
                                <svg className="bd-placeholder-img flex-shrink-0 me-2 ml-2 rounded" width="20" height="20"
                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                    preserveAspectRatio="xMidYMid slice" focusable="false">
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill='#73e5de' />
                                </svg>
                                <div className="media-body mb-0 small lh-125 d-flex justify-content-between align-items-center w-100">
                                    <div className="text-gray-dark">
                                        <b>امتیاز</b>
                                    </div>
                                    <span className='mt-0'>{customerData.TotalPointPersian}</span>
                                </div>
                            </div>
                            <div className="media">
                                <svg className="bd-placeholder-img flex-shrink-0 me-2 ml-2 rounded" width="20" height="20"
                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                    preserveAspectRatio="xMidYMid slice" focusable="false">
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill='#73e5de' />
                                </svg>
                                <div className="media-body mb-0 small lh-125 d-flex justify-content-between align-items-center w-100">
                                    <div className="text-gray-dark">
                                        <b>اعتبار</b>
                                    </div>
                                    <span className='mt-0'>{customerData.AvailableCreditPersian}</span>
                                </div>
                            </div>
                            <div className="media">
                                <svg className="bd-placeholder-img flex-shrink-0 me-2 ml-2 rounded" width="20" height="20"
                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32"
                                    preserveAspectRatio="xMidYMid slice" focusable="false">
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill='#73e5de' />
                                </svg>
                                <div className="media-body mb-0 small lh-125 d-flex justify-content-between align-items-center w-100">
                                    <div className="text-gray-dark">
                                        <b>سطح</b>
                                    </div>
                                    <span className='mt-0'>{customerData.LevelName}</span>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            {loyaltyRule.map(rule => (
                                <div key={rule.RuleId} className="form-check form-check-inline col-4">
                                    <label className="form-check-label" htmlFor={rule.RuleId}>{rule.Title}</label>
                                    <input className="form-check-input" type="radio" name="radioFilter" id="filter-none" checked={selectRule == rule.RuleId} value={rule.RuleId} onChange={e => setRule(e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="mr-2">
                            <div className="input-group mb-3 mt-2 input-group-sm pl-2">
                                <span className="input-group-text" id="basic-addon1">تعداد</span>
                                <input type="number" min="1" id="count" className="form-control form-control-sm" value={count} onChange={e => setCount(e.target.value)} />
                            </div>
                            <div className="input-group mb-2">
                                <button style={{ backgroundColor: '#73e5de' }} disabled={isDisable} type="submit" className="btn rounded text-white" onClick={handleSubmit}>ثبت</button>
                                <button type="reset" className="btn btn-outline-secondary rounded mr-2" onClick={handleCancel}>انصراف</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;