import * as core from '@actions/core';
import * as utils from './utils';
import * as context from './context';
import * as iam from './iam';
import * as credential from './credential';

export async function run() {
    const inputs: context.Inputs = context.getInputs();

    // 如果参数输入有问题，终止操作
    if (!utils.checkInputs(inputs)) {
        core.setFailed('input parameters is not correct.');
        return;
    }

    // 检查用户凭证是否合法
    if (!(await iam.keystoneShowRegion(inputs))) {
        core.setFailed('user credential is not correct.');
        return;
    }

    // 检查projectId是否正常
    if (!(await iam.keystoneShowProject(inputs))) {
        core.setFailed('project_id is not correct.');
        return;
    }

    await credential.exportCredentials(inputs);
}

run().catch(core.setFailed);
