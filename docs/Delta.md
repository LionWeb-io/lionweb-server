The full Delta protocol has quite a lot of messages, these are being implemented one-by-one, but it takes some time to have them all. The table below shows the status of the implementation as of March 27, 2026..
The status is shown for the LionWeb Server, and also for Freon, as we use Freon as the main client for testing.

## Overview of implementation status

# Delta Protocol

Latest generated status: [lionweb-server-test.html](lionweb-server-test.html)

-- create new nodes
insert into "lionweb_nodes"
    ("id","classifier","annotations","parent")
values
    ('ID-2',1,'{}',null);

-- insert containments for new node
insert into "lionweb_containments"
    ("containment","children","node_id")
values
    ('3','{}','ID-2');

insert into "lionweb_properties"
    ("property","value","node_id") 
values
    ('2','Disk_A','ID-2');\n"



