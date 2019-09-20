const NS = 'org.cloud';

function releaseResource(cloudlet) {
  // tx.cloudlet.resource.submissionTime = ;
  // tx.cloudlet.resource.wallClockTime = ;
  // tx.cloudlet.resource.actualCPUTime = ;
  // tx.cloudlet.resource.costPerSec = ;
  // tx.cloudlet.resource.finishedSoFar = ;
  // tx.cloudlet.resource.resourceId = ;
  // tx.cloudlet.resource.resourceName = ;

  // tx.vm.currentAllocatedSize;
  // tx.vm.currentAllocatedRam;
  // tx.vm.currentAllocatedBw;
  // tx.vm.numberOfPes;
  // tx.vm.currentAllocatedMips;
}

function VMScheduler(tx, vms) {
  for (let i = 0; i < vms.length; i++) {
    const vm = vms[i];
    return vm;
  }
}

function LogCloudlet({ tx, status }) {
  const factory = getFactory();
  const log = factory.newConcept(NS, 'CloudletLog');

  log.timestamp = new Date();
  log.status = status;

  if (!tx.cloudlet.log) {
    tx.cloudlet.log = [];
  }

  tx.cloudlet.status = status;
  tx.cloudlet.log.push(log);
}

function isPossible(tx) {
  return true;
}

function Simulate(cloudlet, vm) {
  const transfareTime = cloudlet.size / vm.bw;
  const executeTime = cloudlet.cloudletLength / cloudlet.mips;
  const responseTime = cloudlet.cloudletOutputSize / vm.bw;
  const totalTime = transfareTime + executeTime + responseTime;
  setTimeout(() => {
    CompleteWork(cloudlet);
  }, totalTime);
}

/**
 * @param {org.cloud.SubmitCloudlet} tx
 * @transaction
*/
async function SubmitCloudlet(tx) {
  const cloudletRegistery = await getAssetRegistry(`${NS}.Cloudlet`);
  const userRegistery = await getParticipantRegistry(`${NS}.User`);
  // LogCloudlet({ tx, status: 'CREATED' });
  const factory = getFactory();

  const userId = tx.user.getIdentifier();
  const user = await userRegistery.get(userId);

  if (!user) {
    throw new Error(`user with id ${userId} is not exist.`);
  }
  tx.cloudlet.user = tx.user;
  tx.cloudlet.execStartTime = 0.0;
  tx.cloudlet.finishTime = -1.0;

  if (isPossible(tx)) {
    console.log('posible');
    await cloudletRegistery.update(tx.cloudlet);
    const acceptEvent = factory.newEvent(NS, 'AcceptEvent');
    emit(acceptEvent);
  } else {
    LogCloudlet({ tx, status: 'FAILED_RESOURCE_UNAVAILABLE' });
    const failEvent = factory.newEvent(NS, 'FailEvent');
    emit(failEvent);
  }
}

/**
 * @param {org.cloud.MapResource} tx
 * @transaction
 */
async function MapResource(tx) {
  const cloudletRegistery = await getAssetRegistry(`${NS}.Cloudlet`);
  const vmRegistery = await getAssetRegistry(`${NS.vm}.VM`);
  const vms = await vmRegistery.getAll();

  const selectedVM = VMScheduler(tx, vms);

  if (selectedVM == null) {
    LogCloudlet({ tx, status: 'FAILED_RESOURCE_UNAVAILABLE' });
  }

  tx.cloudlet.vm = selectedVM;

  await cloudletRegistery.update(tx.cloudlet);
}

/**
 * @param {org.cloud.AssignResource} tx
 * @transaction
 */
async function AssignResource(tx) {
  const factory = getFactory();
  // tx.cloudlet.resource.submissionTime = ;
  // tx.cloudlet.resource.wallClockTime = ;
  // tx.cloudlet.resource.actualCPUTime = ;
  // tx.cloudlet.resource.costPerSec = ;
  // tx.cloudlet.resource.finishedSoFar = ;
  // tx.cloudlet.resource.resourceId = ;
  // tx.cloudlet.resource.resourceName = ;

  // tx.vm.currentAllocatedSize;
  // tx.vm.currentAllocatedRam;
  // tx.vm.currentAllocatedBw;
  // tx.vm.numberOfPes;
  // tx.vm.currentAllocatedMips;

  const assignEvent = factory.newEvent(NS, 'Assign');
  emit(assignEvent);
}

/**
 * @param {org.cloud.ExecuteCloudlet} tx
 * @transaction
 */
async function ExecuteCloudlet(tx) {
  const factory = getFactory();
  tx.execStartTime = new Date();
  Simulate(tx.cloudlet);
  const execEvent = factory.newEvent(NS, 'Execute');
  emit(execEvent);
}

/**
 * @param {org.cloud.CompleteWork} tx
 * @transaction
 */
async function CompleteWork(tx) {
  const factory = getFactory();
  tx.cloudlet.finishTime = new Date();
  await releaseResource(tx.Cloudlet);
  const completeEvent = factory.newEvent(NS, 'Complete');
  emit(completeEvent);
}
