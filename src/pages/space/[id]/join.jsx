import v1Manager from '@/shared/v1Manager';
import React from 'react';
import nookies from 'nookies';

function SpaceJoin() {
  return <div>hola</div>
}

export const getServerSideProps = async (ctx) => {
  try {
    /**
     * 1. logout view
     * 2. El usuario no esta en el espacio
     * 3. El usuario ya esta en el espacio
     */

    const cookies = nookies.get({ req: ctx.req });
    const at = cookies.at;
    const { id } = ctx.params;
    const eventResult = await v1Manager.get(`/v1/events/${id}`);

    if (!eventResult?.data?.success) {
      return {
        notFound: true
      };
    }

    const event = eventResult.data.data;

    if (at) {
      // check if user is at the space
      // if it is, redirect to the space
      // if it is not, join the user to the space and show Join success view.

      const joinResult = await v1Manager.post(
        '/v1/events/join', 
        {
          event_code: event.event_code,
        },
        {
          headers: {
            Authorization: 'Bearer ' + at
           }
        }
      );

      const join = joinResult.data.data;
      if (joinResult.data?.success) {
        
      }
    }

    return {
      props: {
        initialEvent: result.data.data
      }
    };
  } catch (error) {
    console.log('ERROR', error);
    return {
      notFound: true
    };
  }
};

export default SpaceJoin;