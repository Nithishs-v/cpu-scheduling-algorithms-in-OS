class Process {
  constructor(pid, arrivalTime, burstTime) {
    this.pid = pid;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
  }
}

function calculateWaitingTime(processes) {
  const waitingTime = [0];

  for (let i = 1; i < processes.length; i++) {
    const previousProcess = processes[i - 1];
    const currentProcess = processes[i];
    const previousBurstTime = previousProcess.burstTime;

    waitingTime[i] = waitingTime[i - 1] + previousBurstTime;

    if (currentProcess.arrivalTime > waitingTime[i]) {
      waitingTime[i] = currentProcess.arrivalTime;
    }
  }

  return waitingTime;
}

function calculateTurnaroundTime(processes, waitingTime) {
  const turnaroundTime = [];

  for (let i = 0; i < processes.length; i++) {
    turnaroundTime[i] = processes[i].burstTime + waitingTime[i];
  }

  return turnaroundTime;
}

function calculateAverageTime(processes) {
  const n = processes.length;
  const waitingTime = calculateWaitingTime(processes);
  const turnaroundTime = calculateTurnaroundTime(processes, waitingTime);

  const totalWaitingTime = waitingTime.reduce((sum, wt) => sum + wt, 0);
  const totalTurnaroundTime = turnaroundTime.reduce((sum, tt) => sum + tt, 0);

  const averageWaitingTime = totalWaitingTime / n;
  const averageTurnaroundTime = totalTurnaroundTime / n;

  return { averageWaitingTime, averageTurnaroundTime };
}

function scheduleProcesses(processes) {
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const { averageWaitingTime, averageTurnaroundTime } = calculateAverageTime(processes);
  const waitingTime = calculateWaitingTime(processes);
  const turnaroundTime = calculateTurnaroundTime(processes, waitingTime);

  const tableBody = document.querySelector('#scheduling-table tbody');
  tableBody.innerHTML = '';

  processes.forEach((process, i) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = process.pid;
    row.insertCell().textContent = process.arrivalTime;
    row.insertCell().textContent = process.burstTime;
    row.insertCell().textContent = waitingTime[i];
    row.insertCell().textContent = turnaroundTime[i];
  });

  document.getElementById('average-waiting-time').textContent = `Average Waiting Time: ${averageWaitingTime.toFixed(2)}`;
  document.getElementById('average-turnaround-time').textContent = `Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}`;
}

function createProcessInputs(count) {
  const processDetails = document.getElementById('process-details');
  processDetails.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const processDiv = document.createElement('div');
    processDiv.innerHTML = `
      <h3>Process: ${i}</h3>
      <label for="arrival-time-${i}">Arrival Time:</label>
      <input type="number" id="arrival-time-${i}" required>
      <label for="burst-time-${i}">Burst Time:</label>
      <input type="number" id="burst-time-${i}" required>
    `;
    processDetails.appendChild(processDiv);
  }
}

document.getElementById('process-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const processCount = parseInt(document.getElementById('process-count').value);
  const processes = [];

  for (let i = 1; i <= processCount; i++) {
    const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
    const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
    processes.push(new Process(i, arrivalTime, burstTime));
  }

  scheduleProcesses(processes);
});
  
document.getElementById('process-count').addEventListener('input', function () {
  const processCount = parseInt(this.value);
  if (!isNaN(processCount) && processCount >= 1) {
    createProcessInputs(processCount);
  }
});