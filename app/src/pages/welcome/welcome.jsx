import 'react-toastify/dist/ReactToastify.css';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { useHistory } from "react-router-dom";
import {
  writeConfigRequest,
} from "secure-electron-store";

const Welcome = () => {
  const history = useHistory();
  const [customer, setCustomer] = useState({
    username: "",
    password: ""
  });

  function handleLogin() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("username", customer.username);
    urlencoded.append("password", customer.password);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch('https://next.dayaclub.com/api/token', requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          window.api.store.send(writeConfigRequest, "token", data.access_token);
          history.push('/home')
        } else {
          toast.warn('اطلاعات وارد شده صحیح نمی باشد');
        }
      })
      .catch(error => toast.error('خطایی رخ داده است، لطفا مجددا تلاش کنید'));
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    let customerData = { ...customer };
    customerData[name] = value;
    setCustomer(customerData);
  };

  return (
    <>
      <ToastContainer autoClose={6000} rtl={true} />
      <section className="intro">
        <div className="mask d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div style={{ borderRadius: '1rem' }}>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body p-5">
                      <i className="fas fa-user-astronaut fa-3x my-5"></i>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="username">نام کاربری</label>
                        <input type="email" id="username" autoComplete="on" name="username" className="form-control form-control-md" value={customer.username} onChange={handleChange} />
                      </div>
                      <div className="form-outline mb-5">
                        <label className="form-label" htmlFor="password">رمز عبور</label>
                        <input type="password" id="password" name="password" className="form-control form-control-md" value={customer.password} onChange={handleChange} />
                      </div>
                      <div className='d-flex justify-content-center align-items-center'>
                        <button className="btn btn-block text-body px-5 flex-grow-1" onClick={handleLogin} type="button" style={{ backgroundColor: '#73e5de' }}>ورود</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Welcome;