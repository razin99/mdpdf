import execa from 'execa';
import Listr from 'listr';

const tasks = new Listr([{
  title: 'Compiling to Javascript',
  task: () => execa("tsc")
}])
tasks.run().catch((e) => console.log(e))
