import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { GET_HYPERVISOR } from "@utils/gql/instance/constant";
import {
  REGION_FILTER,
  ZONE_FILTER,
  ZONE_BEFORE_FILTER,
} from "@utils/gql/filter/constant";
import { useLazyQuery } from "@apollo/client";

import HypervisorBreadcrumbs from "@components/atoms/here";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/table";
import TableModal from "@components/molecules/TableModal";
import { ButtonList } from "@components/atoms/ButtonList";
import { useDebounce } from "use-debounce";
import { ButtonExpand } from "@components/atoms/ButtonExpand";
import MultiBreadcrumbs from "@components/atoms/MultiBreadcrumbs";
import Filter from "@components/atoms/Filter";
import LoadingBar from "@components/atoms/LoadingBar";

const OpenStack = () => {
  const title = "List Hypervisor (Openstack)";

  const [page, setPage] = useState(0);
  const [openList, setOpenList] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dataModal, setDataModal] = useState([]);
  const [rowModal, setRowModal] = useState();
  const [clientName, setClientName] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [regionFilterData, setRegionFilterData] = useState([]);
  const [zoneFilterData, setZoneFilterData] = useState([]);
  const [zoneData, setZoneData] = useState([]);

  const handleOpen = () => setOpenList(true);
  const handleClose = () => {
    setOpenList(false);
  };

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_HYPERVISOR, {
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setDataSource(
          hypervisorsConnection?.data.map((users) => ({
            ...users,
            key: users.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: hypervisorsConnection.total,
          current: page,
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

  const [
    getRegionFilter,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
    variables: {
      limit: 100,
    },
    onCompleted: ({ regionsConnection }) => {
      if (regionsConnection.data.length > 0) {
        setRegionFilterData(
          regionsConnection?.data.map((regions) => ({
            ...regions,
            key: regions.id,
          }))
        );
      } else {
        setRegionFilterData([]);
      }
    },
  });

  const [zoneBefore, { loading, error, refetch }] = useLazyQuery(
    ZONE_BEFORE_FILTER,
    {
      onCompleted: ({ zonesConnection }) => {
        if (zonesConnection.data.length > 0) {
          setZoneData(
            zonesConnection?.data.map((zones) => ({
              ...zones,
              key: zones.id,
            }))
          );
        } else {
          setZoneData([]);
        }
      },
    }
  );

  const [
    getZoneFilter,
    { loading: zoneLoading, error: zoneError, refetch: zoneRefetch },
  ] = useLazyQuery(ZONE_FILTER, {
    variables: {
      input: regionFilter,
    },
    onCompleted: ({ zonesConnection }) => {
      if (zonesConnection.data.length > 0) {
        setZoneFilterData(
          zonesConnection?.data.map((zones) => ({
            ...zones,
            key: zones.id,
          }))
        );
      } else {
        setZoneFilterData([]);
      }
    },
  });

  const handleSearch = (e, skip) => {
    getData({
      variables: {
        or: [
          {
            region: {
              name_contains: regionFilter,
            },
            zone: {
              name_contains: zoneFilter,
            },
            name_contains: e,
          },
        ],
        skip: skip,
        limit: pagination.pageSize,
      },
    });
  };

  useEffect(() => {
    getData({
      variables: {
        or: [
          {
            region: {
              name_contains: regionFilter,
            },
            zone: {
              name_contains: zoneFilter,
            },
            name_contains: searchTerm,
          },
        ],
        skip: pagination.pageSize * page,
        limit: pagination.pageSize,
      },
    });

    getRegionFilter({
      variables: {
        limit: 100,
      },
    });

    getZoneFilter({
      variables: {
        limit: 100,
      },
    });
    zoneBefore({
      variables: {
        limit: 100,
      },
    });
  }, [page, regionFilter, zoneFilter]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(searchTerm, 0);
    } else {
      getData({
        variables: {
          or: [
            {
              region: {
                name_contains: regionFilter,
              },
              zone: {
                name_contains: zoneFilter,
              },
              name_contains: searchTerm,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    }
  }, [debouncedSearchTerm]);

  const handleShow = (data, client, row) => {
    let result = data.reduce(function (r, a) {
      r[a.hostname.slice(0, 8)] = r[a.hostname.slice(0, 8)] || [];
      r[a.hostname.slice(0, 8)].push(a);
      return r;
    }, Object.create(null));

    let array = Object.keys(result).map(function (key) {
      return result[key];
    });

    setDataModal(array);
    setClientName(client);
    setRowModal(row);
    handleOpen();
  };

  const breadcrumbsData = [
    {
      name: "Hypervisor",
      route: "",
    },
    {
      name: "Openstack",
      route: "",
    },
    {
      name: title,
      route: "/hypervisor/openstack/list",
    },
  ];

  const columns = [
    {
      key: "no",
      title: "No",
      headerAlign: "center",
      contentAlign: "center",
      columnsRender: (_, index) => {
        return page * pagination.pageSize + index + 1;
      },
    },
    {
      key: "region",
      title: "Region",
      columnsRender: (row) => {
        return row.region?.name;
      },
    },
    {
      key: "zone",
      title: "Zone",
      columnsRender: (row) => {
        return row.zone?.name;
      },
    },
    {
      key: "name",
      title: "Name",
      columnsRender: (row) => {
        return row.name;
      },
    },
    {
      key: "client",
      title: "Client",
      columnsRender: (row) => {
        let client = row.users.map((a, i) =>
          row.users.length === 1
            ? a.firstName
            : row.users.length - 1 !== i
            ? a.firstName + ", "
            : a.firstName
        );
        return client;
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return `${row.cpu} GHz`;
      },
    },
    {
      key: "totalmemory",
      title: "Total Memory",
      columnsRender: (row) => {
        return `${row.memory} TB`;
      },
    },
    {
      key: "totalstorage",
      title: "Total Storage",
      columnsRender: (row) => {
        return `${row.storage} TB`;
      },
    },
    {
      key: "description",
      title: "Description",
      columnsRender: (row) => {
        return row.description;
      },
    },
    {
      key: "baremetals",
      title: "Baremetals",
      columnsRender: (row) => {
        let client = row.users.map((a) => a.firstName);
        return (
          <div onClick={() => handleShow(row.baremetals, client, row)}>
            <ButtonList />
          </div>
        );
      },
    },
  ];

  const modalColumns = [
    {
      key: "no",
      title: "NO",
      headerAlign: "center",
      contentAlign: "center",
      columnsRender: (_, index) => {
        return <ButtonExpand dataExpand={dataModal[index]} />;
      },
    },
    {
      key: "name",
      title: "Name",
      columnsRender: (row) => {
        // return row[0].hostname.slice(0, 8);
      },
    },
    {
      key: "memory",
      title: "Memory",
      columnsRender: (row) => {
        return row.ramTotal;
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return row.vcpusTotal;
      },
    },
    {
      key: "storagetype",
      title: "Storage Type",
      columnsRender: (row) => {
        return row.storage;
      },
    },
  ];

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <MultiBreadcrumbs title={title} breadcrumbs={breadcrumbsData} />
        </div>

        <PageTitle
          title={title}
          marginBottom="2rem"
          marginTop="1.5rem"
          fontWeight={500}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: 20 }}>
              <Filter
                filterName="Select Region"
                filterData={regionFilterData}
                setFilter={setRegionFilter}
              />
            </div>
            <div style={{ marginRight: 20 }}>
              <Filter
                filterName="Select Zone"
                filterData={regionFilter === "" ? zoneData : zoneFilterData}
                setFilter={setZoneFilter}
              />
            </div>
          </div>
          <div style={{ marginRight: 20 }}>
            <Search onChange={(e) => setSearchTerm(e)} />
          </div>
        </Box>

        <Datatables
          dataSource={dataSource}
          columns={columns}
          page={page}
          setPage={setPage}
          loading={dataLoading}
          pagination={pagination}
        />
        <TableModal
          open={openList}
          close={handleClose}
          baremetals={dataModal}
          columns={modalColumns}
          clientName={clientName}
          rowData={rowModal}
        />
      </Box>
    </div>
  );
};

export default OpenStack;
