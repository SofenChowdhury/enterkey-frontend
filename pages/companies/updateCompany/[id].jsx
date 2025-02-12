import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import { Typography, useTheme, CircularProgress, Button, TextField } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";


const UpdateCompany = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // DATA FOR POST
  const [name, setCompanyName] = useState("");
  const [contact_email, setContactEmail] = useState("");
  const [contact_address, setContactAddress] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [company_tin, setCompanyTin] = useState("");
  const [company_bin, setCompanyBin] = useState("");
  const id = query.id;

  const [formErrors, setFormErrors] = useState("");
  const [loader, setLoader] = useState(true);

  // Fetch Company Details
  useEffect(() => {
    const apiUrl = BASE_URL + "companies";
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          res.data.map((company)=>{
            if (company.comp_id == id) {
              console.log(company.comp_id);
              setLoader(false);
              setCompanyName(company.company_name);
              setContactEmail(company.contact_email);
              setContactAddress(company.contact_address);
              setContactNumber(company.contact_number);
              setContactPerson(company.contact_person);
              setCompanyTin(company.company_tin);
              setCompanyBin(company.company_bin);
            }
          })
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const apiCompany = BASE_URL + "company/update/"+id;
    const companyData = {
      name,
      contact_address,
      contact_number,
      contact_person,
      contact_email,
      company_bin,
      company_tin,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiCompany, companyData, config).then((response) => {
      if (response.data) {
        alert("Company Updated");
        Router.push({
          pathname: "/companies/companyList",
        });
      } else {
        console.log(response.data);
        setFormErrors(response.data.errors);
      }
    });
  };

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/companies/companyList",
    });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <h4 className="text-danger" style={{ fontWeight: 200 }}>
            {formErrors}
          </h4>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Company
          </Typography>
          <div className="mt-2">
            <div className="row">
              <div className="col-md-4 mt-4">
                <TextField
                  label="Company Name"
                  variant="outlined"
                  size="small"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  fullWidth
                  value={contact_email}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="Contact Number"
                  variant="outlined"
                  size="small"
                  type="text"
                  fullWidth
                  value={contact_number}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-4">
                <TextField
                  label="Contact Person"
                  variant="outlined"
                  size="small"
                  type="text"
                  fullWidth
                  value={contact_person}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="TIN"
                  variant="outlined"
                  size="small"
                  type="text"
                  fullWidth
                  value={company_tin}
                  onChange={(e) => setCompanyTin(e.target.value)}
                  className="shadow-input"
                />
              </div>
              <div className="col-md-4 mt-4">
                <TextField
                  label="BIN"
                  variant="outlined"
                  size="small"
                  type="text"
                  fullWidth
                  value={company_bin}
                  onChange={(e) => setCompanyBin(e.target.value)}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-4">
                <TextField
                  label="Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={contact_address}
                  onChange={(e) => {
                    setContactAddress(e.target.value);
                  }}
                  className="shadow-input"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  color="success"
                  className="float-end"
                  onClick={onSubmit}
                >
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={goBack}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

UpdateCompany.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateCompany);
