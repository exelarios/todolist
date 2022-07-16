// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.4;

contract TodoList {

  // Declaring a custom data structure.
  struct Task {
    uint id;
    string content;
    bool done;
  }

  uint public taskCount = 0;


  // Declaring a hash-table, where the key is `uint` and the value is `Task`. 
  // `tasks` has the name of the mapping.
  mapping(uint => Task) public tasks;

  event TaskCreated (
    uint id,
    string content,
    bool done
  );

  event TaskCompleted (
    uint id,
    bool done
  );

  constructor() {
    createTask("deric was here.");
  }

  function createTask(string memory _content) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory currentTask = tasks[_id];
    currentTask.done = !currentTask.done;
    tasks[_id] = currentTask;
    emit TaskCompleted(_id, currentTask.done);
  }

}