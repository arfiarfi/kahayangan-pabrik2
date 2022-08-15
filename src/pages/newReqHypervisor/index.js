import { useLazyQuery, useMutation } from "@apollo/client";
import { ChangeStatus } from "@components/atoms/changeStatus";
import CreateHypervisorCard from "@components/molecules/CreateHypervisorCard";
import {
  GET_REQUEST_HYPERVISOR,
  UPDATE_REQUEST_HYPERVISOR,
} from "@utils/gql/reqOpenstack/constant";
import { useEffect, useState } from "react";

import Openstack from "@assets/openstack.svg";
import VMware from "@assets/vmware.svg";
import BreadCrumbs from "@components/atoms/BreadCrumb";
import bgOval from "@assets/oval.svg";
import windows from "@assets/windows.svg";
import ubuntu from "@assets/ubuntu.svg";
import centos from "@assets/centos.svg";
import openbsd from "@assets/openbsd.svg";
import debian from "@assets/debian.svg";
import { Pagination, Stack, Typography } from "@mui/material";
import LoadingBar from "@components/atoms/LoadingBar";

export default function Index() {
  const [page, setPage] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 5,
  });
  const [isFinish, setIsFinish] = useState(false);
  const [hypervisorData, setHypervisorData] = useState([]);

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_REQUEST_HYPERVISOR, {
    onCompleted: ({ requestHypervisorsConnection }) => {
      if (requestHypervisorsConnection.data.length > 0) {
        setDataSource(
          requestHypervisorsConnection?.data.map((req) => ({
            ...req,
            key: req.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: requestHypervisorsConnection.total,
        }));
      } else {
        setDataSource([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 0,
        }));
      }
    },
  });

  const handleChangePagination = (pageNumber) => {
    setPage(pageNumber - 1);
  };

  useEffect(() => {
    getData({
      variables: {
        // or: [
        //   {
        //     region: {
        //       name_contains: regionFilter,
        //     },
        //     zone: {
        //       name_contains: zoneFilter,
        //     },
        //     name_contains: searchTerm,
        //   },
        // ],
        skip: pagination.pageSize * page,
        limit: pagination.pageSize,
      },
    });
    window.scrollTo(0, 0);
  }, [page]);

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_REQUEST_HYPERVISOR,
    {
      refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
    }
  );

  const handleChangeStatus = (value, rowData) => {
    console.log(rowData.id);
    if (value === "COMPLETE") {
      setIsFinish(true);
    } else if (value === "CANCEL") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            status: "CANCEL",
          },
        },
        refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
      });
    } else if (value === "ONPROGRESS") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            status: "ONPROGRESS",
          },
        },
        refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
      });
    }

    setHypervisorData(rowData);
  };

  const formatYmd = (date) => {
    let month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][new Date(date).getMonth()];

    let dayName = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jum'at",
      "Sabtu",
    ][new Date(date).getDay()];

    let day = new Date(date).getDate();
    let year = new Date(date).getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  return (
    <>
      {dataLoading ? <LoadingBar /> : null}
      <BreadCrumbs />
      <div
        style={{
          width: "100%",
          height: "auto",
          padding: "1rem 2rem",
          boxSizing: "border-box",
        }}
      >
        {isFinish ? (
          <CreateHypervisorCard
            close={() => {
              setIsFinish(false);
              dataRefetch();
            }}
            title="Register New Hypervisor"
            hypervisorData={hypervisorData}
          />
        ) : (
          <></>
        )}
        <h1 style={{ marginBottom: "1rem" }}>Request Hypervisor</h1>
        {/* Card for looping */}
        {dataSource.map((item, index) => (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "1rem 2rem",
              border: "solid 1px #E4E4E4",
              backgroundColor: "#FDF7E9",
              borderRadius: 5,
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              backgroundImage: `url(${bgOval})`,
              backgroundPosition: "150px 50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "300rem",
            }}
            key={index}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 0 1rem 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2>{`${page * pagination.pageSize + index + 1}.`}</h2>
                <h2>{`Request From ${item.createdBy?.firstName}`}</h2>
              </div>
              <h2>{`${formatYmd(item.createdAt)}`}</h2>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* Vendor, Region, Zone */}
              <div
                style={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <h3>Vendor</h3>
                <img
                  src={item.vendor?.name === "openstack" ? Openstack : VMware}
                  alt="vendor"
                  style={{
                    backgroundColor: "white",
                    height: 25,
                    padding: "1.75rem 0",
                    width: "100%",
                    borderRadius: 5,
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  }}
                />
              </div>

              <div
                style={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <h3>Region</h3>
                <p
                  style={{
                    padding: "1.75rem 0",
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: 22,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    borderRadius: 5,
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  }}
                >
                  {item.region?.name}
                </p>
              </div>
              <div
                style={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <h3>Zone</h3>
                <p
                  style={{
                    padding: "1.75rem 0",
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: 22,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    borderRadius: 5,
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  }}
                >
                  {item.zone?.name}
                </p>
              </div>

              {/*End of Vendor, Region, Zone */}
            </div>

            {/* Image */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <h3>Image</h3>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "2%",
                  flexWrap: "wrap",
                }}
              >
                {item.operatingSystems?.map((os) => (
                  <div style={{ width: "32%", marginBottom: "1rem" }}>
                    <div
                      style={{
                        textAlign: "center",
                        boxSizing: "border-box",
                        padding: "1rem 0",
                        fontWeight: 900,
                        marginBottom: 5,
                        display: "flex",
                        gap: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        backgroundColor: "white",
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      }}
                    >
                      <img
                        src={
                          os.name === "Ubuntu"
                            ? ubuntu
                            : os.name === "Debian"
                            ? debian
                            : os.name === "Windows"
                            ? windows
                            : os.name === "Centos 7"
                            ? centos
                            : openbsd
                        }
                        alt="logo"
                        style={{ height: "4rem" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <h4 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                          {os.name}
                        </h4>
                        {os.version !== null ? <h3>{os.version}</h3> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* End of Image */}

            {/* Specification */}
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <h3 style={{ marginBottom: 10 }}>Specification</h3>
              <div
                style={{
                  backgroundColor: "white",
                  boxSizing: "border-box",
                  padding: "1rem",
                  borderRadius: 5,
                  width: "80%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <p style={{ width: "30%", fontWeight: 900 }}>CPU</p>
                  <p>:</p>

                  {item?.selectPackages === null ? (
                    <p style={{ width: "60%" }}>{item.customCpuCore} Core</p>
                  ) : (
                    <p style={{ width: "60%" }}>
                      {item.selectPackages?.core} Core
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <p style={{ width: "30%", fontWeight: 900 }}>Storage</p>
                  <p>:</p>
                  {item?.selectPackages !== null ? (
                    <p style={{ width: "60%" }}>
                      {item.selectPackages?.storage} GB{" "}
                      {item.selectPackages?.storageType}
                    </p>
                  ) : (
                    <p style={{ width: "60%" }}>
                      {item.customStorageSize} GB {item.customStorageType}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <p style={{ width: "30%", fontWeight: 900 }}>RAM</p>
                  <p>:</p>
                  {item?.selectPackages !== null ? (
                    <p style={{ width: "60%" }}>{`${
                      item.selectPackages?.memory >= 1000
                        ? `${item.selectPackages?.memory / 1000} GB RAM`
                        : `${item.selectPackages?.memory} MB RAM`
                    }`}</p>
                  ) : (
                    <p style={{ width: "60%" }}>{`${
                      item.customMemory >= 1000
                        ? `${item.customMemory / 1000} GB RAM`
                        : `${item.customMemory} MB RAM`
                    }`}</p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <p style={{ width: "30%", fontWeight: 900 }}>Cluster</p>
                  <p>:</p>
                  <p style={{ width: "60%" }}>{item?.totalCluster}</p>
                </div>
              </div>
            </div>
            {/* End Of Specification */}

            {/* Status */}
            <div
              style={{
                width: "100%",
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div>
                <ChangeStatus
                  handleChange={(value) => handleChangeStatus(value, item)}
                  statusReqHypervisor={item.status}
                />
              </div>
            </div>
            {/* End of Status */}
          </div>
        ))}

        {/* End of Card for looping */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1.25rem",
            paddingBottom: "1.25rem",
          }}
        >
          <div>
            <Typography sx={{ color: "black" }}>{`${
              page * pagination.pageSize + 1
            }-${page * pagination.pageSize + dataSource.length} of ${
              pagination.total
            }`}</Typography>
          </div>
          <div>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(pagination.total / pagination.pageSize)}
                shape="rounded"
                onChange={(event, pageNumber) =>
                  handleChangePagination(pageNumber)
                }
                page={page + 1}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
}
