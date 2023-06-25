import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface StyledDrawerProps {
    loggout: () => void;
    handleDrawerClose: () => void;
    open: boolean;
    drawerWidth: number;
}

export function StyledDrawer({ loggout, handleDrawerClose, open, drawerWidth }: StyledDrawerProps) {

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const theme = useTheme();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem key={'products'} disablePadding component="a" href="/products">
                    <ListItemButton>
                        <ListItemIcon>
                            <FastfoodIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Produtos'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'orders'} disablePadding component="a" href="/orders">
                    <ListItemButton>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Pedidos'} />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem key={`products`} disablePadding onClick={loggout}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Desconectar'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}

