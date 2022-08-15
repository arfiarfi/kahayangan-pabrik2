import Login from "@pages/login";
import Register from "@pages/register";
import Dashboard from "@pages/dashboard";
import OpenStack from "@pages/openstack";
import Location from "@pages/zone";
import openstackInstance from "@pages/openstackInstance";
import openstackVolume from "@pages/openstackVolume";
import ReqOpenStack from "@pages/reqOpenstack";
import ListClient from "@pages/client";
import ReqProjectOpenstack from "@pages/reqProjectOpenstack";
import OpenstackProject from "@pages/openstackProject";
import Hypervisor from "@pages/hypervisor";
import VmWare from "@pages/vmWare";
import VmWareProject from "@pages/vmWareProject";
import VmwareInstance from "@pages/vmWareInstance";
import VmwareVolume from "@pages/vmWareVolume";
import newReqHypervisor from "@pages/newReqHypervisor";

const routes = [
  {
    id: 1,
    path: "/",
    component: Login,
  },
  {
    id: 2,
    path: "/register",
    component: Register,
  },
  {
    id: 3,
    path: "/dashboard",
    requireAuth: true,
    component: Dashboard,
  },
  {
    id: 4,
    path: "/hypervisor/openstack/list",
    requireAuth: true,
    component: OpenStack,
  },
  {
    id: 5,
    path: "/zone",
    requireAuth: true,
    component: Location,
  },
  {
    id: 6,
    path: "/hypervisor/openstack/instance",
    requireAuth: true,
    component: openstackInstance,
  },
  {
    id: 7,
    path: "/hypervisor/openstack/volume",
    requireAuth: true,
    component: openstackVolume,
  },
  {
    id: 8,
    path: "/request/openstack/list",
    requireAuth: true,
    component: ReqOpenStack,
  },
  {
    id: 9,
    path: "/client",
    requireAuth: true,
    component: ListClient,
  },
  {
    id: 10,
    path: "/request/openstack/project",
    requireAuth: true,
    component: ReqProjectOpenstack,
  },
  {
    id: 11,
    path: "/hypervisor/openstack/project",
    requireAuth: true,
    component: OpenstackProject,
  },
  {
    id: 12,
    path: "/hypervisor/wmWare/list",
    requireAuth: true,
    component: VmWare,
  },
  {
    id: 13,
    path: "/hypervisor/vmware/project",
    requireAuth: true,
    component: VmWareProject,
  },
  {
    id: 14,
    path: "/hypervisor",
    requireAuth: true,
    component: Hypervisor,
  },
  {
    id: 15,
    path: "/hypervisor/vmware/instance",
    requireAuth: true,
    component: VmwareInstance,
  },
  {
    id: 16,
    path: "/hypervisor/vmware/volume",
    requireAuth: true,
    component: VmwareVolume,
  },
  {
    id: 17,
    path: "/request/newReq",
    requireAuth: true,
    component: newReqHypervisor,
  },
];

export default routes;
