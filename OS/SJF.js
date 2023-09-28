class Process {
    constructor(pid, arrivalTime, burstTime) {
      this.pid = pid;
      this.arrivalTime = arrivalTime;
      this.burstTime = burstTime;
    }
  }
  
  function calculateWaitingTime(processes) {
    const n = processes.length;
    const burstTimeCopy = processes.map((process) => process.burstTime);
    const waitingTime = new Array(n).fill(0);
    let complete = 0;
    let currentTime = 0;
  
    while (complete < n) {
      let shortestJobIndex = -1;
      let shortestBurstTime = Infinity;
  
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= currentTime && burstTimeCopy[i] < shortestBurstTime && burstTimeCopy[i] > 0) {
          shortestJobIndex = i;
          shortestBurstTime = burstTimeCopy[i];
        }
      }
  
      if (shortestJobIndex === -1) {
        currentTime++;
      } else {
        burstTimeCopy[shortestJobIndex]--;
        currentTime++;
        if (burstTimeCopy[shortestJobIndex] === 0) {
          waitingTime[shortestJobIndex] = currentTime - processes[shortestJobIndex].arrivalTime - processes[shortestJobIndex].burstTime;
          complete++;
        }
      }
    }
  
    return waitingTime;
  }
  
  function calculateTurnaroundTime(processes, waitingTime) {
    const n = processes.length;
    const turnaroundTime = new Array(n);
  
    for (let i = 0; i < n; i++) {
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
  
  document.getElementById('process-form').addEventListener('submit', function(e) {
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
  
  document.getElementById('process-count').addEventListener('input', function() {
    const processCount = parseInt(this.value);
    if (!isNaN(processCount) && processCount >= 1) {
      createProcessInputs(processCount);
    }
  });
  