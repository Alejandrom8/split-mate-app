const Ticket = ({ picture, place, uploaded_at, description, total, total_with_tip }) => {
    /**
     * 
     * Picture
     * name
     * uploaded by
     * date
     * items
     * Total
     * Total with tip
     */
    return <div className="ticket">
        <div>
            <img src={picture} />
        </div>
        <div>
            {place}
        </div>
        <div>
            {total}
        </div> 
        <div>
            {total_with_tip}
        </div>
    </div>;
};