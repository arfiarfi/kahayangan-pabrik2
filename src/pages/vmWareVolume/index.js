import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { VMWARE_VOLUME } from "@utils/gql/volume/constant";
import {
  REGION_FILTER,
  ZONE_FILTER,
  ZONE_BEFORE_FILTER,
  HYPERVISOR_FILTER,
  HYPER_BEFORE,
  PROJECT_FILTER,
  PROJECT_AFTER,
} from "@utils/gql/instance/constant";
import { useLazyQuery } from "@apollo/client";

import SingleBreadcrumb from "@components/atoms/SingleBreadrumb";
import { PageTitle } from "@components/atoms/pageTitle";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/tableVMVolume";
import { useDebounce } from "use-debounce";
import LoadingBar from "@components/atoms/LoadingBar";
import Filter from "@components/atoms/Filter";

export default function VmwareInstance() {
  const title = "List Volume (VMware)";

  const [page, setPage] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [hypervisorFilter, setHypervisorFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [regionFilterData, setRegionFilterData] = useState([]);
  const [zoneFilterData, setZoneFilterData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [hyperFilterData, setHyperFilterData] = useState([]);
  const [hyperData, setHyperData] = useState([]);
  const [projectFilterData, setProjectFilterData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  // querying data
  const [getData, { loading: dataLoading, data: getVmData }] = useLazyQuery(
    VMWARE_VOLUME,
    {
      onCompleted: ({ vmwareVolumesConnection }) => {
        if (vmwareVolumesConnection.data) {
          setDataSource(
            vmwareVolumesConnection?.data.map((volume) => ({
              ...volume,
              key: volume.id,
            }))
          );

          setPagination((prev) => ({
            ...prev,
            total: vmwareVolumesConnection.total,
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
    }
  );

  const [
    getRegionFilter,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
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

  const [
    getHypervisorFilter,
    { loading: hypeLoading, error: hypeError, refetch: hypeRefetch },
  ] = useLazyQuery(HYPERVISOR_FILTER, {
    variables: {
      region: regionFilter,
      zone: zoneFilter,
    },
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setHyperFilterData(
          hypervisorsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setHyperFilterData([]);
      }
    },
  });

  const [
    hyperBefore,
    {
      loading: hypeBeforeLoading,
      error: hypeBeforeError,
      refetch: hypeBeforeRefetch,
    },
  ] = useLazyQuery(HYPER_BEFORE, {
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setHyperData(
          hypervisorsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setHyperData([]);
      }
    },
  });

  const [
    projData,
    { loading: projLoading, error: projError, refetch: projRefetch },
  ] = useLazyQuery(PROJECT_FILTER, {
    onCompleted: ({ projectsConnection }) => {
      if (projectsConnection.data.length > 0) {
        setProjectFilterData(
          projectsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setProjectFilterData([]);
      }
    },
  });

  const [
    projAfter,
    {
      loading: projAfterLoading,
      error: projAfterError,
      refetch: projAfterRefetch,
    },
  ] = useLazyQuery(PROJECT_AFTER, {
    variables: {
      region: regionFilter,
      zone: zoneFilter,
      hypervisor: hypervisorFilter,
    },
    onCompleted: ({ projectsConnection }) => {
      if (projectsConnection.data.length > 0) {
        setProjectData(
          projectsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setProjectData([]);
      }
    },
  });

  const handleSearch = (e, skip) => {
    getData({
      variables: {
        or: [
          {
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
    getHypervisorFilter({
      variables: {
        limit: 100,
      },
    });
    hyperBefore({
      variables: {
        limit: 100,
      },
    });
    projData({
      variables: {
        limit: 100,
      },
    });
    projAfter({
      variables: {
        limit: 100,
      },
    });
  }, [page, regionFilter, zoneFilter, hypervisorFilter, projectFilter]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(searchTerm, 0);
    } else {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    }
  }, [debouncedSearchTerm]);

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
        return row.vmwares.project.hypervisor.zone.region.name;
      },
    },
    {
      key: "zone",
      title: "Zone",
      columnsRender: (row) => {
        return row.vmwares.project.hypervisor.zone.name;
      },
    },

    {
      key: "hypervisor",
      title: "Hypervisor",
      columnsRender: (row) => {
        return row.vmwares.project.hypervisor.name;
      },
    },
    {
      key: "project",
      title: "Project",
      columnsRender: (row) => {
        return row.vmwares.project.name;
      },
    },
    {
      key: "updatedBy",
      title: "Client",
      columnsRender: (row) => {
        return row.vmwares.project.updatedBy.firstName;
      },
    },
    {
      key: "size",
      title: "Size",
      columnsRender: (row) => {
        return `${row?.size} GB`;
      },
    },
    {
      key: "status",
      title: "Status",
      columnsRender: (row) => {
        return "In-Use";
      },
    },
    {
      key: "type",
      title: "Type",
      columnsRender: (row) => {
        return "_DEFAULT_";
      },
    },
    {
      key: "attachTo",
      title: "Attach To",
      columnsRender: (row) => {
        return `on Instance ${row?.vmwares.name}`;
      },
    },
  ];

  console.log(dataSource);

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumb title="Instance" route="openstack/instance" />
        </div>

        <PageTitle
          title={title}
          marginBottom="2rem"
          marginTop="1.5rem"
          fontWeight={500}
        />
        <Box
          sx={{
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
            }}
          >
            <Filter
              filterName="Select Region"
              setFilter={setRegionFilter}
              filterData={regionFilterData}
            />
            <Filter
              filterName="Select Zone"
              setFilter={setZoneFilter}
              filterData={regionFilter === "" ? zoneData : zoneFilterData}
            />
          </div>
          <Search onChange={(e) => setSearchTerm(e)} />
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            gap: "1.5rem",
          }}
        >
          <Filter
            filterName="Select Hypervisor"
            setFilter={setHypervisorFilter}
            filterData={
              regionFilter === "" || zoneFilter === ""
                ? hyperData
                : hyperFilterData
            }
          />
          <Filter
            filterName="Select Project"
            setFilter={setProjectFilter}
            filterData={
              regionFilter === "" ||
              zoneFilter === "" ||
              hypervisorFilter === ""
                ? projectFilterData
                : projectData
            }
          />
        </Box>

        <Datatables
          dataSource={dataSource}
          columns={columns}
          page={page}
          setPage={setPage}
          loading={dataLoading}
          pagination={pagination}
          region={regionFilter}
          zone={zoneFilter}
          hypervisor={hypervisorFilter}
          proj={projectFilter}
        />
      </Box>
    </div>
  );
}
