import { getAlertsSuccessAction } from '../../../store/reducers/slice/getalerts';
import { v4 as uuidv4 } from 'uuid';
import { AppReduxStore } from '../../../store';

const addAlert = (type: string, content: string) => {
    const getAlerts = AppReduxStore.getState().getalerts.data;
    AppReduxStore.dispatch(
        getAlertsSuccessAction([
            ...getAlerts,
            {
                id: uuidv4(),
                type: type,
                content: content,
            },
        ])
    );
};

export { addAlert };
