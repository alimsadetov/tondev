pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;


contract contract_3_2 {
    int8 index =0;
    struct Task {
        string name;
        uint32 timestamp;
        bool isDone;
    }


    constructor() public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
    }


    mapping(int8 => Task) public list;
    
    
    modifier checkOwnerAndAccept {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
		_;
	}
	//функция добавления задания
    function addTask(string _name) public checkOwnerAndAccept{
        index+=1;
        list[index] = Task(_name, now, false);
    }
	//функция возвращающая количество выполненных заданий
    function getCountOfOpenedTasks() public checkOwnerAndAccept returns(int8){
        int8 count =0;
        for (int8 i = 0;i<=index;i++){
            if (list.exists(i)){
                if (list[i].isDone ==true){
                    count+=1;
                }
            }
        }
        return count;
    }



	//функция возвращает весь список заданий
    function getTaskList() public checkOwnerAndAccept returns(Task[]){
        Task[] tasklist;
        for (int8 i = 0; i<=index;i++){
            if (list.exists(i)){
                tasklist.push(list[i]);
            }
        }
        return tasklist;
    }

	//функция возвращает название задачи по её номеру
    function getTaskNameByKey(int8 key) public checkOwnerAndAccept returns(string){
        require(list.exists(key), 3, "there is no task with this key");
        return list[key].name;
    }
	// функция удаляет задачу с данным номером и пересчитывает номера всех остальных задач (чтобы не было например 12356 а стало 12345)
    function deleteTaskByKey(int8 key) public checkOwnerAndAccept{
        require(list.exists(key), 4, "there is no task with this key");
        for (int8 i = key;i<index;i++){
            list[i] = list[i+1];
        }
        delete list[index];
        index-=1;
    }

	//функция ставящая флаг выполнено в данное задание
    function setIsDoneTrue(int8 key) public checkOwnerAndAccept{
        require(list.exists(key), 5, "there is no task with this key");
        list[key].isDone = true;
    }
}
