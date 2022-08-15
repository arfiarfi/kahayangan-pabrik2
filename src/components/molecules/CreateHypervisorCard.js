import { Box, Button, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_HYPERVISOR } from "@utils/gql/hypervisor/constant";
import { GET_REGIONS } from "@utils/gql/region/constant";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateHypervisor.module.css";
import { useState, useEffect } from "react";
import openstack from "@assets/openstack2.png";
import vmware from "@assets/vmware2.png";
import {
  CREATE_HYPERVISOR_FROM_REQ_OPENSTACK,
  GET_REQUEST_HYPERVISOR,
  CREATE_NEW_BAREMETAL,
  GET_REQ_OPENSTACK,
  UPDATE_REQUEST_HYPERVISOR,
  UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
} from "@utils/gql/reqOpenstack/constant";

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className={cssModules.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <textarea className={cssModules.textArea} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default function CreateHypervisorCard({ close, title, hypervisorData }) {
  const CreateHypervisorSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    regionId: Yup.string().required(`Region is required`),
    zoneId: Yup.string().required(`Zone is required`),
    cpu: Yup.number().required(`CPU is required`),
    memory: Yup.number().required(`Memory is required`),
    storage: Yup.number().required(`Storage is required`),
    endpoint: Yup.string().required(`Endpoint is required`),
    port: Yup.string().required(`Port is required`),
    vendor: Yup.string().required(`Vendor is required`),
    username: Yup.string().required(`Username is required`),
    password: Yup.string().required(`Password is required`),
  });

  const [showPassword, setShowPassword] = useState(false);

  const [vendor, setVendor] = useState([]);
  const [vendorValue, setVendorValue] = useState("");

  let baremetalData = [];

  for (let i = 1; i <= hypervisorData.setBaremetals.length; i++) {
    baremetalData.push(hypervisorData.setBaremetals[i - 1]);
  }

  const [addBaremetal, { data: bmData }] = useMutation(CREATE_NEW_BAREMETAL);

  const [mutationAddData, { data: addData }] = useMutation(
    CREATE_HYPERVISOR_FROM_REQ_OPENSTACK,
    {
      onCompleted: async (data) => {
        const newBaremetal = baremetalData.map((v) => ({
          ...v,
          hypervisorId: data.createHypervisor.id,
          vendor: hypervisorData.vendor.name,
        }));

        newBaremetal.forEach((obj) => {
          delete obj["__typename"];
          delete obj["id"];
        });

        await addBaremetal({
          variables: {
            inputs: newBaremetal,
          },
        });
      },
    }
  );

  const { data: getRegionsData } = useQuery(GET_REGIONS);

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_REQUEST_HYPERVISOR,
    {
      refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
    }
  );

  const GET_VENDOR = gql`
    query {
      vendors {
        name
        icon
      }
    }
  `;
  const { data, loading, error } = useQuery(GET_VENDOR);
  useEffect(() => {
    if (data) {
      setVendor(data.vendors);
    }
  }, [data]);

  const GET_SPECIFIC = gql`
    query {
      zones {
        id
        name
        region {
          id
        }
      }
    }
  `;
  const { data: getSpecificZone } = useQuery(GET_SPECIFIC);

  function getFields(input, field) {
    let output = [];
    for (let i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output;
  }

  const result = getFields(hypervisorData.setBaremetals, "id");

  return (
    <>
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          bgcolor: "#00000050",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 88,
        }}
        onClick={close}
      ></Box>

      {/* Card */}
      <Box
        sx={{
          width: "30rem",
          height: "auto",
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 150,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #D8D8D8",
            boxSizing: "border-box",
            p: "1rem 1.5rem",
          }}
        >
          <Typography fontSize="1.5rem" style={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <ClearIcon onClick={close} sx={{ cursor: "pointer" }} />
        </Box>

        {/* Form Card */}
        <Box sx={{ boxSizing: "border-box", p: "1rem 1.5rem 1.5rem 1.5rem" }}>
          <Formik
            initialValues={{
              name: "",
              regionId: hypervisorData.region.id,
              zoneId: hypervisorData.zone.id,
              cpu:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.cpu
                  : hypervisorData.customCpuCore,
              memory:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.memory
                  : hypervisorData.customMemory,
              storage:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.storage
                  : hypervisorData.customStorageSize,
              vendor: hypervisorData.vendor.name,
              userIds: hypervisorData.createdBy.id,
              baremetals: result,
              endpoint: "",
              description: "",
              username: "",
              password: "",
              port: 0,
            }}
            validationSchema={CreateHypervisorSchema}
            onSubmit={async (values) => {
              await mutationAddData({
                variables: {
                  input: {
                    name: values.name,
                    regionId: values.regionId,
                    zoneId: values.zoneId,
                    cpu: values.cpu,
                    memory: values.memory,
                    storage: values.storage,
                    endpoint: values.endpoint,
                    description: values.description,
                    vendor: values.vendor,
                    usersIds: values.userIds,
                    baremetalsIds: values.baremetals,
                    auth:
                      values.vendor === "openstack"
                        ? JSON.stringify({
                            auth: {
                              identity: {
                                methods: ["password"],
                                password: {
                                  user: {
                                    name: values.username,
                                    domain: { name: "Default" },
                                    password: values.password,
                                  },
                                },
                              },
                            },
                          })
                        : JSON.stringify({
                            host: values.endpoint,
                            user: values.username,
                            pwd: values.password,
                            port: values.port,
                          }),
                  },
                },
              });

              updateStatus({
                variables: {
                  id: hypervisorData.id,
                  input: {
                    status: "COMPLETE",
                  },
                },
                refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
              });
              close();
            }}
          >
            {({ errors, touched, values }) => (
              <Form className={cssModules.form}>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="name">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Insert name"
                      className={cssModules.input}
                    />
                    {errors.name && touched.name ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.name}
                      </Typography>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className={cssModules.label} htmlFor="endpoint">
                    Endpoint
                  </label>
                  <Field
                    type="text"
                    name="endpoint"
                    id="endpoint"
                    placeholder="e.g. http://10.10.10.10"
                    className={cssModules.input}
                  />
                  {errors.endpoint && touched.endpoint ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.endpoint}
                    </Typography>
                  ) : null}
                </div>

                {hypervisorData.vendor.name !== "openstack" ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label className={cssModules.label} htmlFor="endpoint">
                      Port
                    </label>
                    <Field
                      type="number"
                      name="port"
                      id="port"
                      placeholder="e.g. 443"
                      className={cssModules.input}
                    />
                    {errors.port && touched.port ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.port}
                      </Typography>
                    ) : null}
                  </div>
                ) : null}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className={cssModules.label} htmlFor="username">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Insert Username"
                    className={cssModules.input}
                  />
                  {errors.username && touched.username ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.username}
                    </Typography>
                  ) : null}
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <label className={cssModules.label} htmlFor="password">
                    Password
                  </label>
                  <Field
                    type={!showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    placeholder="Insert Password"
                    className={cssModules.input}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 45,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                  {errors.password && touched.password ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.password}
                    </Typography>
                  ) : null}
                </div>

                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <MyTextArea
                    label="Description"
                    name="description"
                    id="description"
                    rows="4"
                    placeholder="e.g. Located in Surabaya, has 5 Racks, etc."
                  />
                </div> */}

                <Buttons
                  className={cssModules.btnSave}
                  title="Submit"
                  variant="contained"
                  bg="#EAB737"
                  color="white"
                  width="100%"
                  height="2.75rem"
                  fWeight={200}
                  fSize={18}
                  radius="2px"
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}
