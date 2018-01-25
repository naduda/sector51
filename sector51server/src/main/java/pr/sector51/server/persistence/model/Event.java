package pr.sector51.server.persistence.model;

public class Event {
    private int id;
    private String name;
    private String desc;

    public Event(){}

    public Event(int id, String name){
        this();
        this.id = id;
        this.name = name;
    }

    public Event(int id, String text, String description){
        this(id, text);
        this.desc = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int eventId) {
        this.id = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String text) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
