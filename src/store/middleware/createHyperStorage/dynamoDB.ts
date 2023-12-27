import { StorageValue } from 'zustand/middleware/persist';

export const createDynamoDB = <State extends any>() => ({
  getItem: async <T extends State>(name: string): Promise<StorageValue<T> | undefined> => {
    try {
      const response = await fetch(`/api/db/chat/get-item?key=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from DynamoDB');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting item from DynamoDB', error);
      throw error;
    }
  },

  setItem: async <T extends State>(name: string, state: T, version: number | undefined) => {
    try {
      const response = await fetch('/api/db/chat/set-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: name,
          data: state,
          version,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data to DynamoDB');
      }
    } catch (error) {
      console.error('Error saving item to DynamoDB', error);
      throw error;
    }
  },

  removeItem: async <T extends State>(name: string, state: T, version: number | undefined) => {
    try {
      const response = await fetch('/api/db/chat/remove-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: name,
          data: state,
          version,
          deleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark item as deleted in DynamoDB');
      }
    } catch (error) {
      console.error('Error removing item from DynamoDB', error);
      throw error;
    }
  },
});
