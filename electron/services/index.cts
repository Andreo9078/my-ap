import { roleService } from "./auth/roleService.cjs";
import { userService } from "./auth/userService.cjs";
import { techTypeService } from "./requests/techTypeService.cjs";
import { requestStatusService } from "./requests/requestStatusService.cjs";
import { detailService } from "./requests/detailService.cjs";
import { requestService } from "./requests/requestService.cjs";
import { commentService } from "./requests/commentService.cjs";
import { usedDetailsService } from "./requests/usedDetailsService.cjs";

const services: Record<string, any> = {
  auth: {
    role: roleService,
    user: userService,
  },
  requests: {
    techType: techTypeService,
    requestStatus: requestStatusService,
    detail: detailService,
    request: requestService,
    comment: commentService,
    usedDetail: usedDetailsService,
  },
};

export { services };
