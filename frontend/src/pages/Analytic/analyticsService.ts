import axios from 'axios';

const BASE_URL = 'http://localhost:5000/analytics';

export interface TotalTimeResponse {
    total_time_spent: number;
    total_estimated_time: number;
}

export interface DailyTimeResponse {
    [date: string]: number;
}

export interface TaskStatusResponse {
    [status: string]: number;
}

export const getTotalTime = async (userId: string, token: string): Promise<TotalTimeResponse> => {
    const response = await axios.get<TotalTimeResponse>(`${BASE_URL}/total-time/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// export const getDailyTime = async (userId: string, token: string): Promise<DailyTimeResponse> => {
//     const response = await axios.get<DailyTimeResponse>(`${BASE_URL}/daily-time/${userId}`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     return response.data;
// };

export const getDailyTime = async (userId: string, token: string): Promise<DailyTimeResponse> => {
    const response = await axios.get<DailyTimeResponse>(`${BASE_URL}/daily-time/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
    const rawData = response.data;
    const transformedData = Object.entries(rawData).reduce(
        (acc, [date, seconds]) => {
            acc[date] = Math.floor(seconds / 60);
            return acc;
        },
        {} as DailyTimeResponse
    );
    return transformedData;
};


export const getTaskStatus = async (userId: string, token: string): Promise<Record<string, number>> => {
    const response = await axios.get<Record<string, number>>(`${BASE_URL}/task-status/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const rawData = response.data;
    const statusMap: Record<string, string> = {
        T: 'Todo ',
        IP: 'In Progress ',
        C: 'Completed ',
        E: 'Expired ',
    };
    const transformedData = Object.entries(rawData).reduce(
        (acc, [key, value]) => {
            const mappedKey = statusMap[key] || key;
            acc[mappedKey] = value;
            return acc;
        },
        {} as Record<string, number>
    );
    return transformedData;
};
