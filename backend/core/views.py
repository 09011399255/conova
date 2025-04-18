from .serializers import (FloorSerializer, RoomSerializer, SeatSerializer, WorkspaceSerializer)
from .models import (Floor, Room, Seat, Workspace,)
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework import viewsets

class WorkspaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows workspaces to be viewed or edited.
    
    - **List**: Returns all workspaces
    - **Create**: Adds a new workspace with availability
    - **Retrieve**: Gets a workspace and its schedule
    """
    
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer

class FloorViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows floors to be viewed or edited.
    
    - **List**: Returns all floors for a particular workspace
    - **Create**: Adds a new to floor to a workspace
    - **Retrieve**: Gets a floor under a particular workspace
    """
    
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer
    
    def get_queryset(self):
        return self.queryset.filter(workspace_id=self.kwargs["workspace_pk"])
    
    def perform_create(self, serializer):
        workspace_id = self.kwargs["workspace_pk"]
        return serializer.save(workspace_id=workspace_id)


class RoomViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows rooms to be viewed or edited.

    - **List**: Returns all rooms
    - **Create**: Adds a new room with availability
    - **Retrieve**: Gets a room and its schedule
    """

    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class SeatViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows seats to be viewed or edited.

    - **List**: Returns all seats
    - **Create**: Adds a new seat
    - **Retrieve**: Gets a seat
    """

    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
