// import { CLASH_URL } from '@/lib/apiEndPoints';

// export async function fetchClashs(token: string) {
//   const res = await fetch(CLASH_URL, {
//     headers: {
//       Authorization: token,
//     },
//     next: {
//       revalidate: 60 * 60,
//       tags: ['dashboard'],
//     },
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   const response = await res.json();
//   if (response?.data) {
//     return response?.data;
//   }
//   return [];
// }
// export async function fetchClash(id: number) {
//   const res = await fetch(`${CLASH_URL}/${id}`, { cache: 'no-cache' });

//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   const response = await res.json();
//   if (response?.data) {
//     return response?.data;
//   }
//   return null;
// }





import { CLASH_URL } from '@/lib/apiEndPoints';

// Fetch ALL clashes for dashboard
export async function fetchClashs(token: string) {
  try {
    console.log(`Fetching all clashes from: ${CLASH_URL}`);
    
    const res = await fetch(CLASH_URL, { 
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Fetch error response:', errorText);
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    console.log('Fetch successful:', response);
    return response.data || [];
  } catch (error) {
    console.error('Error in fetchClashs:', error);
    throw error;
  }
}


export async function fetchClash(id: number) {
  try {
    console.log(`Fetching single clash from: ${CLASH_URL}/${id}`);
    
    const res = await fetch(`${CLASH_URL}/${id}`, { 
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Fetch error response:', errorText);
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    console.log('Fetch successful:', response);
    return response.data;
  } catch (error) {
    console.error('Error in fetchClash:', error);
    throw error;
  }
}