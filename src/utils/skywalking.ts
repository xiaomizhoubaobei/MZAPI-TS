import {default as agent} from "skywalking-backend-js";

export function initSkyWalking() {
    agent.start({
        serviceName: 'MZAPI',
        collectorAddress: 'tracing-analysis-dc-sh.aliyuncs.com:8000',
        authorization: 'brynnu6nw1@b7977de42e6387c_brynnu6nw1@53df7ad2afe8301'
    });
}