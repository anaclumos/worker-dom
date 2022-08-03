import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { MessageType } from '../../transfer/Messages';
import { CommandExecutorInterface } from './interface';
import { BoundClientRectMutationIndex, TransferrableBoundingClientRect } from '../../transfer/TransferrableBoundClientRect';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';

export const BoundingClientRectProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.GET_BOUNDING_CLIENT_RECT);

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean): number {
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          const boundingRect = target.getBoundingClientRect();
          workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.data]: [
              boundingRect.top,
              boundingRect.right,
              boundingRect.bottom,
              boundingRect.left,
              boundingRect.width,
              boundingRect.height,
            ],
          });
        } else {
          console.error(`GET_BOUNDING_CLIENT_RECT: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + BoundClientRectMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target,
        allowedExecution,
      };
    },
  };
};

const sleep = async (ms: number) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    console.log('sleep');
  }
  return Date.now();
};

export const SynchronousBoundingClientRectProcessor: CommandExecutorInterface = (strings, nodes, workerContext, objectContext, config) => {
  const allowedExecution = config.executorsAllowed.includes(TransferrableMutationType.GET_BOUNDING_CLIENT_RECT);

  console.log('SynchronousBoundingClientRectProcessor IS CALLED. SharedArrayBuffer:');

  return {
    execute(mutations: Uint16Array, startPosition: number, allowedMutation: boolean, sharedArrayBuffer: SharedArrayBuffer): number {
      if (!sharedArrayBuffer) {
        console.error('SynchronousBoundingClientRectProcessor: sharedArrayBuffer is null.');
        return startPosition + BoundClientRectMutationIndex.End;
      }
      console.log('intentional delay for 2 seconds');
      sleep(2000);
      console.log('is sharedArrayBuffer null? ', sharedArrayBuffer);
      if (allowedExecution && allowedMutation) {
        const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
        const target = nodes.getNode(targetIndex);
        if (target) {
          const boundingRect = target.getBoundingClientRect();

          const payload: TransferrableBoundingClientRect = [
            boundingRect.top,
            boundingRect.right,
            boundingRect.bottom,
            boundingRect.left,
            boundingRect.width,
            boundingRect.height,
          ];
          console.log('SynchronousBoundingClientRectProcessor: payload:', payload);
          // put data into sharedArrayBuffer
          const int32 = new Int32Array(sharedArrayBuffer);
          int32.set(payload, 0);
          console.log('SynchronousBoundingClientRectProcessor: payload put into sharedArrayBuffer.', int32, sharedArrayBuffer);
          workerContext.messageToWorker({
            [TransferrableKeys.type]: MessageType.GET_BOUNDING_CLIENT_RECT,
            [TransferrableKeys.target]: [target._index_],
            [TransferrableKeys.sharedArrayBuffer]: sharedArrayBuffer,
          });
          Atomics.notify(int32, 0);
        } else {
          console.error(`GET_BOUNDING_CLIENT_RECT: getNode(${targetIndex}) is null.`);
        }
      }

      return startPosition + BoundClientRectMutationIndex.End;
    },
    print(mutations: Uint16Array, startPosition: number): {} {
      const targetIndex = mutations[startPosition + BoundClientRectMutationIndex.Target];
      const target = nodes.getNode(targetIndex);
      return {
        type: 'GET_BOUNDING_CLIENT_RECT',
        target,
        allowedExecution,
      };
    },
  };
};
