import React from 'react'
import { useState } from 'react';
import {
    writeConfigRequest,
} from "secure-electron-store";

const Settings = () => {
    const [baseUrl, setBaseUrl] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleForm = () => {
        window.api.store.send(writeConfigRequest, "baseUrl", baseUrl);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="card-body p-5">
                <i className="fas fa-user-astronaut fa-3x my-5"></i>
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="username">دامنه باشگاه مشتریان</label>
                    <input type="email" id="username" autoComplete="on" name="username" className="form-control form-control-md" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <button className="btn btn-block text-body px-5 flex-grow-1" onClick={handleForm} type="button" style={{ backgroundColor: '#73e5de' }}>ثبت</button>
                </div>
            </div>
        </form>
    );
}

export default Settings;